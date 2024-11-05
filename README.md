# Socio 🚀

Socio is more than just a chat application – it's a comprehensive community platform that combines the power of real-time communication with modern social features. Built with the latest web technologies, it offers a smooth, intuitive experience that feels native across all devices.

## ✨ Features

- **Real-time Communication** - Instant messaging powered by Socket.IO
- **Server Creation** - Create and manage your own communities
- **Channels** - Text, voice, and video channels for diverse communication needs
- **Direct Messaging** - Private conversations between users
- **Role-based Permissions** - Granular control over user access and capabilities
- **File Sharing** - Easy file uploads and sharing via UploadThing
- **Rich Media Support** - Share images, pdfs, and other media formats
- **Video Calls** - Crystal-clear video communication using LiveKit
- **Authentication** - Secure user authentication powered by Clerk
- **Responsive Design** - Seamless experience across all devices

## 🛠️ Tech Stack

- Next.js 14 - React framework for production
- TailwindCSS - Utility-first CSS framework
- Shadcn UI - Pre-built UI components
- Zustand - State management
- Axios - HTTP client
- Query String - URL query string parsing
- Socket.IO - Real-time bidirectional communication
- PostgreSQL - Primary database (hosted on NeonDB)
- Prisma - Type-safe ORM
- Zod - TypeScript-first schema validation
- LiveKit SDK - Video streaming capabilities
- Clerk - Authentication and user management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL
- NPM or Yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/PrtHub/socio.git
cd socio
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Update the `.env` file with your credentials:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL=/

DATABASE_URL=

UPLOADTHING_TOKEN=
UPLOADTHING_SECRET=

NEXT_PUBLIC_SITE_URL=

LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=
NEXT_PUBLIC_LIVEKIT_URL=
```

5. Run database migrations
```bash
npx prisma migrate dev
```

6. Start the development server
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see your app running!

## 📝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Discord for inspiration
- All the amazing open-source libraries that made this possible
- Our wonderful community of contributors

## 📞 Contact

Your Name - [@PritamGhosh](https://x.com/PritamGhosh010)

Project Link: [https://socio.up.railway.app](https://socio.up.railway.app)

---
⭐️ Star on GitHub — it helps!
