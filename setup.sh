#!/bin/bash

echo "🐕 Veterinary Medication Calculator Setup"
echo "=========================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found. Creating one..."
    cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
EOF
    echo "✅ Created .env.local file"
else
    echo "✅ .env.local file exists"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Go to https://supabase.com and create a new project"
echo "2. Copy your project URL and anon key from Project Settings → API"
echo "3. Update the values in .env.local file"
echo "4. Run: npm run dev"
echo ""
echo "🔧 To edit .env.local:"
echo "   code .env.local"
echo "   # or"
echo "   nano .env.local"
echo ""
echo "📚 For detailed setup instructions, see SETUP.md"
echo ""
echo "🚀 Ready to start? Run: npm run dev"
