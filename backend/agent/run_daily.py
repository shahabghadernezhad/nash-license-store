#!/usr/bin/env python3
"""
Daily Blog Agent Runner
Run this script once a day via cron/scheduler to auto-generate blog posts.

Cron example (daily at 9 AM):
  0 9 * * * cd /path/to/nash-license-store/backend && python agent/run_daily.py

Or use Hermes cron job for automated scheduling.
"""
import os
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'store.settings')

import django
django.setup()

from agent.blog_agent import run_daily

if __name__ == '__main__':
    print("=" * 50)
    print("  🤖 Nash-Security Blog Agent - Daily Run")
    print("=" * 50)
    print()

    posts_created = run_daily()

    print()
    print("=" * 50)
    if posts_created > 0:
        print(f"  ✅ {posts_created} posts created successfully!")
    else:
        print("  ⚠️  No new posts (feeds may be slow or already covered)")
    print("=" * 50)
