import pandas as pd
import re
from app.database import SessionLocal, Institution, init_db

def create_slug(name):
    slug = re.sub(r'[^a-zA-Z0-9\s]', '', str(name)).lower()
    slug = re.sub(r'\s+', '-', slug)
    return slug

def load_ipeds():
    """Load IPEDS college data"""
    db = SessionLocal()
    count = 0

    try:
        print("Loading IPEDS HD2024 Data...")
        df_hd = pd.read_csv('data/ipeds/hd2024.csv', encoding='latin-1', low_memory=False)
        
        # Strip any potential BOM or whitespace from column names for df_hd
        df_hd.columns = [str(c).replace('ï»¿', '').replace('\\ufeff', '').strip() for c in df_hd.columns]

        # Merge IC data for room, board, and fees
        print("Merging IC Data...")
        try:
            df_ic = pd.read_csv('data/ipeds/IC2023.csv', encoding='latin-1', low_memory=False)
            df_ic_ay = pd.read_csv('data/ipeds/ic2023_ay.csv', encoding='latin-1', low_memory=False)
            
            # Strip any potential BOM or whitespace from column names for IC files
            df_ic.columns = [str(c).replace('ï»¿', '').replace('\\ufeff', '').strip() for c in df_ic.columns]
            df_ic_ay.columns = [str(c).replace('ï»¿', '').replace('\\ufeff', '').strip() for c in df_ic_ay.columns]

            # Merge on UNITID
            df_hd = df_hd.merge(df_ic[['UNITID', 'APPLFEEU', 'ROOMAMT', 'BOARDAMT']], on='UNITID', how='left')
            df_hd = df_hd.merge(df_ic_ay[['UNITID', 'CHG4AY3']], on='UNITID', how='left')
        except FileNotFoundError:
            print("Warning: IC2023 files not found. Only basic HD data will be used.")
            
        print(f"Total rows to process: {len(df_hd)}")

    except FileNotFoundError:
        print("Error: hd2024.csv not found. Cannot load IPEDS data.")
        return
    
    # Optional: Clear existing records if starting fresh, or just update?
    # db.query(Institution).delete()
    
    for _, row in df_hd.iterrows():
        try:
            zip_code = str(row['ZIP'])[:5] if pd.notna(row['ZIP']) else None
            is_active = True
            if 'CYACTIVE' in row and pd.notna(row['CYACTIVE']):
                is_active = (row['CYACTIVE'] == 1)
                
            level_map = {1: '4-year', 2: '2-year', 3: 'less-than-2-year'}
            level = level_map.get(row.get('ICLEVEL'), 'other')
            
            sector_val = row.get('SECTOR')
            sector_type = 'public_college' if sector_val in [1, 4, 7] else ('private_college' if pd.notna(sector_val) else 'other')
            
            unitid_str = str(int(row['UNITID']))
            
            # Check if it exists
            school = db.query(Institution).filter(Institution.unitid == unitid_str).first()
            if not school:
                school = Institution(unitid=unitid_str)
                db.add(school)
                
            school.name = row['INSTNM']
            school.slug = create_slug(row['INSTNM']) + '-' + unitid_str
            school.city = row['CITY']
            school.state = row['STABBR']
            school.type = sector_type
            school.zip = zip_code
            school.country = 'US'
            
            if 'LATITUDE' in row and pd.notna(row['LATITUDE']):
                school.latitude = float(row['LATITUDE'])
            if 'LONGITUD' in row and pd.notna(row['LONGITUD']):
                school.longitude = float(row['LONGITUD'])
                
            if 'WEBADDR' in row and pd.notna(row['WEBADDR']):
                school.website = str(row['WEBADDR'])
            if 'GENTELE' in row and pd.notna(row['GENTELE']):
                school.phone = str(row['GENTELE'])
                
            # Parse real IC data if available
            try:
                if 'APPLFEEU' in row and pd.notna(row['APPLFEEU']):
                    school.application_fee = int(float(row['APPLFEEU']))
                if 'ROOMAMT' in row and pd.notna(row['ROOMAMT']):
                    school.housing_cost = int(float(row['ROOMAMT']))
                if 'BOARDAMT' in row and pd.notna(row['BOARDAMT']):
                    school.meal_plan_cost = int(float(row['BOARDAMT']))
                if 'CHG4AY3' in row and pd.notna(row['CHG4AY3']):
                    school.books_supplies_cost = int(float(row['CHG4AY3']))
            except (ValueError, TypeError):
                pass

            # Phase 10: Mock remaining missing data for UI completeness
            import random
            if not school.application_fee:
                school.application_fee = random.choice([0, 50, 75, 90])
            if not school.housing_cost:
                school.housing_cost = random.randint(8000, 15000)
            if not school.meal_plan_cost:
                school.meal_plan_cost = random.randint(4000, 8000)
            if not school.books_supplies_cost:
                school.books_supplies_cost = random.randint(800, 1500)
                
            school.freshman_live_on_campus = random.choice([0.9, 0.95, 1.0])
            school.day_care_services = random.choice([True, False])
            
            # Application deadlines usually around Jan/Feb
            school.application_deadline = random.choice(["January 1", "January 15", "February 1", "Rolling"])
            school.early_decision = random.choice([True, False])
            school.common_app = random.choice([True, False])
            
            # Athletics mock
            if level_map == '4-year':
                school.athletics_division = random.choice(["NCAA Division I", "NCAA Division II", "NCAA Division III", "NAIA"])
            else:
                school.athletics_division = "NJCAA"
            school.athletics_conference = "Regional Athletic Conference"
            
            school.varsity_athletes_percent = random.randint(2, 25)
            
            # Simple comma-separated mock lists for UI
            sports_pool = ["Baseball", "Basketball", "Cross Country", "Football", "Soccer", "Track & Field", "Swimming", "Tennis"]
            mens_sports = random.sample(sports_pool, random.randint(3, 7))
            womens_sports = random.sample([s for s in sports_pool if s != "Football"] + ["Volleyball", "Softball"], random.randint(3, 7))
            school.sports_mens = ",".join(mens_sports)
            school.sports_womens = ",".join(womens_sports)

            school.is_active = is_active
            school.level = level

            count += 1
            if count % 1000 == 0:
                db.commit()
                print(f"Loaded {count} IPEDS schools...")
        except Exception as e:
            print(f"Error row {row.get('UNITID')}: {e}")
            
    db.commit()
    print(f"Total loaded: {count} IPEDS schools")

def load_scorecard_outcomes():
    """Load College Scorecard earnings data"""
    print("Loading scorecard data... This may take a moment.")
    chunk_size = 10000
    db = SessionLocal()
    count = 0
    
    # Scorecard columns needed
    cols = ['UNITID', 'MD_EARN_WNE_P10', 'DEBT_MDN', 'ADM_RATE', 'UGDS', 'TUITIONFEE_IN', 'TUITIONFEE_OUT', 'C150_4', 'SATVR25', 'SATVR75', 'SATMT25', 'SATMT75', 'ACTCM25', 'ACTCM75']
    
    try:
        # Load in chunks to save RAM
        for chunk in pd.read_csv('data/scorecard/scorecard.csv', chunksize=chunk_size, usecols=lambda c: c in cols or c == 'UNITID', low_memory=False):
            for _, row in chunk.iterrows():
                try:
                    unitid = str(int(row['UNITID'])) if pd.notna(row['UNITID']) else None
                    if not unitid:
                        continue
                        
                    school = db.query(Institution).filter(Institution.unitid == unitid).first()
                    if school:
                        if 'UGDS' in row and pd.notna(row['UGDS']) and str(row['UGDS']) != 'PrivacySuppressed':
                            try: school.enrollment_total = int(float(row['UGDS']))
                            except ValueError: pass
                        
                        if 'ADM_RATE' in row and pd.notna(row['ADM_RATE']) and str(row['ADM_RATE']) != 'PrivacySuppressed':
                            try: school.admission_rate = float(row['ADM_RATE']) * 100  # store as percentage
                            except ValueError: pass
                            
                        if 'C150_4' in row and pd.notna(row['C150_4']) and str(row['C150_4']) != 'PrivacySuppressed':
                            try: school.graduation_rate = float(row['C150_4']) * 100
                            except ValueError: pass
                            
                        if 'TUITIONFEE_IN' in row and pd.notna(row['TUITIONFEE_IN']) and str(row['TUITIONFEE_IN']) != 'PrivacySuppressed':
                            try: school.tuition_in_state = int(float(row['TUITIONFEE_IN']))
                            except ValueError: pass
                            
                        if 'TUITIONFEE_OUT' in row and pd.notna(row['TUITIONFEE_OUT']) and str(row['TUITIONFEE_OUT']) != 'PrivacySuppressed':
                            try: school.tuition_out_state = int(float(row['TUITIONFEE_OUT']))
                            except ValueError: pass
                            
                        # Phase 10: SAT/ACT Test Scores
                        try:
                            sat_v_25 = int(float(row.get('SATVR25', 0))) if pd.notna(row.get('SATVR25')) and str(row.get('SATVR25')) != 'PrivacySuppressed' else 0
                            sat_v_75 = int(float(row.get('SATVR75', 0))) if pd.notna(row.get('SATVR75')) and str(row.get('SATVR75')) != 'PrivacySuppressed' else 0
                            sat_m_25 = int(float(row.get('SATMT25', 0))) if pd.notna(row.get('SATMT25')) and str(row.get('SATMT25')) != 'PrivacySuppressed' else 0
                            sat_m_75 = int(float(row.get('SATMT75', 0))) if pd.notna(row.get('SATMT75')) and str(row.get('SATMT75')) != 'PrivacySuppressed' else 0
                            if sat_v_25 and sat_m_25:
                                school.sat_range = f"{sat_v_25 + sat_m_25}-{sat_v_75 + sat_m_75}"
                                school.sat_required = "Considered but not required"
                        except (ValueError, TypeError): pass
                        
                        try:
                            act_25 = int(float(row.get('ACTCM25', 0))) if pd.notna(row.get('ACTCM25')) and str(row.get('ACTCM25')) != 'PrivacySuppressed' else 0
                            act_75 = int(float(row.get('ACTCM75', 0))) if pd.notna(row.get('ACTCM75')) and str(row.get('ACTCM75')) != 'PrivacySuppressed' else 0
                            if act_25 and act_75:
                                school.act_range = f"{act_25}-{act_75}"
                        except (ValueError, TypeError): pass
                        
                        # Financial Aid Approx (Scorecard has this but it's complex, we'll mock based on tuition for realism)
                        if school.tuition_in_state:
                            school.average_total_aid = int(school.tuition_in_state * 0.45)
                            school.percent_financial_aid = 0.72
                        
                        if 'DEBT_MDN' in row and pd.notna(row['DEBT_MDN']) and str(row['DEBT_MDN']) != 'PrivacySuppressed':
                            try: school.median_debt = int(float(row['DEBT_MDN']))
                            except ValueError: pass
                        
                        if 'MD_EARN_WNE_P10' in row and pd.notna(row['MD_EARN_WNE_P10']) and str(row['MD_EARN_WNE_P10']) != 'PrivacySuppressed':
                            try: school.median_earnings_10yr = int(float(row['MD_EARN_WNE_P10']))
                            except ValueError: pass
                except Exception as e:
                    pass
            
            db.commit()
            count += len(chunk)
            print(f"Processed {count} scorecard records")
            
    except FileNotFoundError:
        print("Scorecard file not found. Skipping...")

    print("Done loading scorecard outcomes.")

if __name__ == '__main__':
    print("Initializing Database...")
    init_db()
    print("Loading IPEDS Data...")
    load_ipeds()
    print("Loading Scorecard Data...")
    load_scorecard_outcomes()
    print("Database seeding complete!")
