import React from "react";
import { Twitter, Facebook, Instagram, Linkedin } from "lucide-react";
import Header from "../components/ui/custom/Header";

const teamMembers = [
  {
    name: "Aditya Pachouri",
    role: "Backend Developer & AI Integration Specialist",
    description: "Designing and implementing efficient backend architectures to support the platform’s functionality. Ensuring data security, system performance, and smooth API interactions.",
    image: "/adiphoto.jpeg",
    social: { twitter: "#", facebook: "#", instagram: "https://www.instagram.com/aditya_pachouri29?igsh=MTZleHRhN3prdDluaA==", linkedin: "https://www.linkedin.com/in/adityapachouri/" }
  },
  {
    name: "Aaysha Abid",
    role: "Frontend Designer",
    description: "Skilled in UI/UX design, and testing user flows.",
    image: "/ash.png",
    social: { twitter: "https://x.com/Aayshaabid23?t=ttBkSMwxah-c1XP4aiTwKg&s=09", facebook: "#", instagram: "https://www.instagram.com/aaysha.23?igsh=azU5OG12Y2FoMjIw", linkedin: "https://www.linkedin.com/in/aaysha-abid-886228247?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" }
  },
  {
    name: "Garv Batra",
    role: "Frontend Developer",
    description: "Designing and developing responsive, user-friendly interfaces that enhance the overall experience.",
    image: "/garv.png",
    social: { twitter: "#", facebook: "https://www.facebook.com/profile.php?id=61552654169416&mibextid=ZbWKwL", instagram: "https://www.instagram.com/garv_batra06?igsh=MTZleHRhN3prdDluaA==", linkedin: "https://www.linkedin.com/in/garv-batra-0655352b2" }
  },
  {
    name: "Ambar Kumar",
    role: "",
    description: "Helped in making Logo Design & Frontend Design.",
    image: "/ambar.png",
    social: { twitter: "https://x.com/CoderAmbar", facebook: "https://www.facebook.com/profile.php?id=61560526666745", instagram: "https://www.instagram.com/theambarofficial?igsh=MTZleHRhN3prdDluaA==", linkedin: "https://www.linkedin.com/in/coderambar/" }
  },
];

const AboutUs = () => {
  return (
    <>
      <div>
        <Header />
      </div>
      {/* Team Section */}
      <section className=" mt-6 relative px-4 bg-gradient-to-b from-[#ffffff] to-blue-100">
        <div className="absolute inset-0 bg-pattern bg-opacity-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-500 mb-4">
              OUR TEAM
            </h2>
            <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
              The minds behind your seamless travel experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-[120px] h-[120px] rounded-full shadow-lg border-4 border-blue-100"
                  />
                  <div>
                    <h3 className="text-xl font-semibold text-blue-600">{member.name}</h3>
                    <p className="text-gray-600 text-sm">{member.role}</p>
                    <p className="text-gray-500 mt-2">{member.description}</p>
                    <div className="flex gap-4 mt-4">
                      {Object.entries(member.social).map(([key, link]) => (
                        link && (
                          <a
                            key={key}
                            href={link}
                            className="text-gray-400 hover:text-blue-500 transition-colors"
                            aria-label={`${member.name}'s ${key}`}
                          >
                            {key === "twitter" && <Twitter className="h-6 w-6" />}
                            {key === "facebook" && <Facebook className="h-6 w-6" />}
                            {key === "instagram" && <Instagram className="h-6 w-6" />}
                            {key === "linkedin" && <Linkedin className="h-6 w-6" />}
                          </a>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="relative py-16 px-4 bg-gradient-to-b from-blue-100 to-white">
        <div className="absolute inset-0 bg-pattern bg-opacity-10 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-500 mb-4">
              ABOUT US
            </h1>
            <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
              Discover our story, mission, and the values that inspire us to redefine travel planning.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div className="bg-white rounded-lg p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all">
              <h2 className="text-3xl font-bold text-blue-600 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2024, our journey began with a simple idea: to make travel planning seamless, accessible, and truly personalized.
              </p>
              <p className="text-gray-600">
                Today, we continue to push boundaries and set new standards in our field. Our team of dedicated professionals works tirelessly to bring cutting-edge solutions to our clients.
              </p>
            </div>
            <div className="bg-white rounded-lg p-8 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all">
              <h2 className="text-3xl font-bold text-blue-600 mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                Our mission is to revolutionize travel planning by harnessing the power of AI to create personalized and hassle-free experiences.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Delivering exceptional value through innovative travel solutions</li>
                <li>Continuously improving to meet the evolving needs of modern travelers</li>
                <li>Promoting sustainability and responsible travel practices</li>
                <li>Building a community of trust, transparency, and shared wanderlust</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;
