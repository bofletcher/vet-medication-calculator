# Veterinary Medication Calculator

A comprehensive Next.js application for veterinarians to calculate precise medication dosages for dogs and cats based on weight, with user authentication, favorites system, and the ability to add custom medications.

## Features

- 🐕 **Multi-Species Support**: Calculate dosages for dogs, cats, or both
- 📊 **Weight-Based Calculations**: Precise dosage calculations based on animal weight (kg/lbs)
- ❤️ **Favorites System**: Save frequently used medications for quick access
- ➕ **Add Custom Medications**: Expand the database with new medications and dosage guidelines
- 🔐 **User Authentication**: Secure user accounts with Supabase Auth
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone and Install

\`\`\`bash
git clone <your-repo-url>
cd vet-medication-calculator
npm install
\`\`\`

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your keys
3. Create a \`.env.local\` file in the root directory:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
\`\`\`

### 3. Set up Database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of \`supabase-schema.sql\` 
4. Run the SQL to create tables, policies, and sample data

### 4. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Database Schema

The application uses the following main tables:

- **medications**: Store medication information (name, species, category, etc.)
- **dosage_guidelines**: Weight-based dosage calculations for each medication
- **user_profiles**: User information and preferences
- **user_favorites**: User's favorite medications

### Schema Management

- **`supabase-schema.sql`**: Initial database setup (run once)
- **`database-changes.sql`**: Track all future schema modifications
- **`migrations/`**: Optional CLI-based migrations for advanced workflows

## Deployment

### Deploy to Vercel

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - \`NEXT_PUBLIC_SUPABASE_URL\`
   - \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
   - \`SUPABASE_SERVICE_ROLE_KEY\`
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/vet-medication-calculator)

## Usage

### For Veterinarians

1. **Sign Up/Sign In**: Create an account to access favorites and add medications
2. **Select Species**: Choose dogs, cats, or both
3. **Browse Medications**: View all available medications or filter by favorites
4. **Calculate Dosage**: 
   - Select a medication
   - Enter animal weight
   - Click "Calculate Dosage" for precise results
5. **Add to Favorites**: Click the heart icon to save frequently used medications
6. **Add New Medications**: Use the "Add New Medication" button to expand the database

### Sample Medications Included

- Rimadyl (Carprofen) - NSAID
- Metacam (Meloxicam) - NSAID  
- Tramadol - Analgesic
- Gabapentin - Anticonvulsant
- Prednisone - Corticosteroid
- Amoxicillin - Antibiotic
- Clavamox - Antibiotic
- Cerenia (Maropitant) - Antiemetic

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Security & Compliance

- Row Level Security (RLS) enabled on all tables
- User data isolation
- Secure authentication with Supabase
- Input validation with Zod schemas

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This tool is for informational purposes only and should not replace professional veterinary judgment. Always consult current veterinary guidelines and drug information before prescribing medications.

## Support

For issues and feature requests, please create an issue in the GitHub repository.