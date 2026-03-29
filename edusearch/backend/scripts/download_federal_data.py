#!/usr/bin/env python3
"""
Download Federal Education Data
Fetches IPEDS and College Scorecard directly from government sources
"""

import requests
import zipfile
import io
import os
from pathlib import Path
from tqdm import tqdm  # Progress bar

# Configuration
DATA_DIR = Path(__file__).parent.parent / "data"
DATA_DIR.mkdir(exist_ok=True)

def download_with_progress(url, output_path, desc="Downloading"):
    """Download file with progress bar"""
    print(f"\n{desc}...")
    print(f"URL: {url}")
    
    try:
        response = requests.get(url, stream=True, timeout=300)
        response.raise_for_status()
        
        total_size = int(response.headers.get('content-length', 0))
        block_size = 1024  # 1 Kibibyte
        
        with open(output_path, 'wb') as f:
            if total_size == 0:
                f.write(response.content)
            else:
                with tqdm(total=total_size, unit='iB', unit_scale=True) as pbar:
                    for data in response.iter_content(block_size):
                        f.write(data)
                        pbar.update(len(data))
        
        print(f"✅ Saved to: {output_path}")
        print(f"📊 Size: {output_path.stat().st_size / 1024 / 1024:.1f} MB")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def download_ipeds():
    """Download IPEDS 2023 data"""
    print("=" * 80)
    print("📥 DOWNLOADING IPEDS DATA")
    print("=" * 80)
    
    ipeds_dir = DATA_DIR / "ipeds"
    ipeds_dir.mkdir(exist_ok=True)
    
    # HD2023 - Directory information (most important)
    hd_url = "https://nces.ed.gov/ipeds/datacenter/data/HD2023.zip"
    hd_zip = ipeds_dir / "HD2023.zip"
    hd_dir = ipeds_dir / "HD2023"
    
    if hd_dir.exists():
        print("✅ IPEDS HD2023 already downloaded")
        return True
    
    if download_with_progress(hd_url, hd_zip, "Downloading IPEDS Directory (HD2023)"):
        print("📦 Extracting...")
        with zipfile.ZipFile(hd_zip, 'r') as zip_ref:
            zip_ref.extractall(hd_dir)
        print("✅ Extracted successfully")
        return True
    
    return False

def download_scorecard():
    """Download College Scorecard"""
    print("\n" + "=" * 80)
    print("📥 DOWNLOADING COLLEGE SCORECARD")
    print("=" * 80)
    
    scorecard_dir = DATA_DIR / "scorecard"
    scorecard_dir.mkdir(exist_ok=True)
    
    # Try these URLs in order
    urls_to_try = [
        "https://ed-public-download.app.cloud.gov/downloads/Most-Recent-Cohorts-All-Data-Elements.csv.gz",  # Compressed
        "https://collegescorecard.ed.gov/assets/InstitutionData/Most-Recent-Cohorts-All-Data-Elements.csv",  # Alternative path
        "https://ed-public-download.app.cloud.gov/downloads/CollegeScorecard_Raw_Data.zip",  # Full archive
    ]
    
    output_file = scorecard_dir / "scorecard.csv"
    
    if output_file.exists():
        print("✅ Scorecard already downloaded")
        return True
    
    for url in urls_to_try:
        # Determine appropriate output file name based on URL
        if url.endswith(".gz"):
            current_output = scorecard_dir / "scorecard.csv.gz"
        elif url.endswith(".zip"):
            current_output = scorecard_dir / "scorecard.zip"
        else:
            current_output = output_file
            
        print(f"\nTrying URL: {url}")
        if download_with_progress(url, current_output, f"Downloading from {url.split('/')[-1]}"):
            
            # Extract if necessary
            if url.endswith(".gz"):
                print("📦 Extracting gzip...")
                import gzip
                import shutil
                with gzip.open(current_output, 'rb') as f_in:
                    with open(output_file, 'wb') as f_out:
                        shutil.copyfileobj(f_in, f_out)
                print("✅ Extracted successfully")
            elif url.endswith(".zip"):
                print("📦 Extracting zip...")
                with zipfile.ZipFile(current_output, 'r') as zip_ref:
                    # The zip likely contains logic we'd need to adapt, 
                    # but for now extract everything to the scorecard dir
                    zip_ref.extractall(scorecard_dir)
                print("✅ Extracted successfully. You may need to rename the specific CSV to scorecard.csv")
                
            return True
            
    return False

def main():
    print("🎓 EDUSEARCH - Federal Data Downloader")
    print("This will download ~500MB of education data")
    print("Source: US Department of Education (nces.ed.gov)")
    
    # Install tqdm if needed
    try:
        import tqdm
    except ImportError:
        print("\nInstalling required package...")
        import subprocess
        subprocess.check_call(["pip", "install", "tqdm"])
        print("✅ Installed tqdm")
    
    # Download data
    success = True
    success &= download_ipeds()
    success &= download_scorecard()
    
    if success:
        print("\n" + "=" * 80)
        print("✅ ALL DOWNLOADS COMPLETE")
        print("=" * 80)
        print("\nNext step: Run load_federal_data.py to import into database")
    else:
        print("\n⚠️  Some downloads failed. Check errors above.")
        print("Alternative: Download manually from:")
        print("  - IPEDS: https://nces.ed.gov/ipeds/datacenter/DataFiles.aspx")
        print("  - Scorecard: https://collegescorecard.ed.gov/data/")

if __name__ == "__main__":
    main()
