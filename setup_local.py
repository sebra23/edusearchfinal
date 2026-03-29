#!/usr/bin/env python3
"""
EduSearch Local Setup Script
Run this on your local machine to create the project structure
"""

import os
import sys

def create_project():
    base_dir = "edusearch-prototype"
    
    # Create directories
    dirs = [
        f"{base_dir}/backend/app/routers",
        f"{base_dir}/backend/scripts",
        f"{base_dir}/backend/data",
        f"{base_dir}/frontend/src/components/Layout",
        f"{base_dir}/frontend/src/pages",
        f"{base_dir}/frontend/src/context",
        f"{base_dir}/frontend/src/services",
        f"{base_dir}/docs"
    ]
    
    for d in dirs:
        os.makedirs(d, exist_ok=True)
        print(f"Created: {d}")
    
    print(f"\n✅ Project structure created in ./{base_dir}/")
    print("Next: Add the file contents (see documentation)")

if __name__ == "__main__":
    create_project()
