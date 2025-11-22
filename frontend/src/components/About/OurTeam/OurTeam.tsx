'use client';
import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

interface TeamMember {
  id: number;
  name: string;
  position: string;
  image: string;
  bio: string;
  social: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
}

const OurTeam: React.FC = () => {
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'John Doe',
      position: 'CEO & Founder',
      image: '/team/team-1.jpg',
      bio: 'Leading the vision and strategy of the company with over 15 years of experience.',
      social: {
        facebook: '#',
        twitter: '#',
        linkedin: '#',
      },
    },
    {
      id: 2,
      name: 'Jane Smith',
      position: 'Creative Director',
      image: '/team/team-2.jpg',
      bio: 'Bringing creative ideas to life with her innovative design approach.',
      social: {
        instagram: '#',
        twitter: '#',
      },
    },
    {
      id: 3,
      name: 'Mike Johnson',
      position: 'Marketing Manager',
      image: '/team/team-3.jpg',
      bio: 'Driving growth through strategic marketing and brand development.',
      social: {
        facebook: '#',
        linkedin: '#',
      },
    },
    {
      id: 4,
      name: 'Sarah Williams',
      position: 'Product Manager',
      image: '/team/team-4.jpg',
      bio: 'Ensuring product excellence and user satisfaction in every release.',
      social: {
        twitter: '#',
        instagram: '#',
      },
    },
  ];

  return (
    <section id="our-team" className="py-25">
      <div className="container">
        <div className="text-center pb-12.5">
          <h2 className="text-3xl font-normal">Our Team</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="relative h-[300px] w-full mb-7.5 group md:h-[220px] sm:h-[150px] perspective-[600px]"
            >
              {/* Front of card */}
              <div className="absolute h-full w-full px-1.25 overflow-hidden backface-hidden transition-transform duration-600 ease-linear transform-3d">
                <div className="h-full w-full">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-full w-full object-cover rounded-lg"
                  />
                </div>
              </div>

              {/* Back of card */}
              <div className="absolute inset-0 bg-primary flex flex-col justify-center items-center text-white p-5 rotate-y-180 transition-transform duration-600 ease-linear transform-3d">
                <div className="flex flex-col justify-center items-center text-center">
                  <h5 className="text-lg font-semibold mb-2">{member.name}</h5>
                  <p className="text-sm mb-4">{member.position}</p>
                  <p className="text-sm mb-4">{member.bio}</p>
                  <ul className="flex gap-3">
                    {member.social.facebook && (
                      <li>
                        <a
                          href={member.social.facebook}
                          className="text-black hover:text-white transition-colors duration-400"
                        >
                          <FaFacebook size={18} />
                        </a>
                      </li>
                    )}
                    {member.social.twitter && (
                      <li>
                        <a
                          href={member.social.twitter}
                          className="text-black hover:text-white transition-colors duration-400"
                        >
                          <FaTwitter size={18} />
                        </a>
                      </li>
                    )}
                    {member.social.instagram && (
                      <li>
                        <a
                          href={member.social.instagram}
                          className="text-black hover:text-white transition-colors duration-400"
                        >
                          <FaInstagram size={18} />
                        </a>
                      </li>
                    )}
                    {member.social.linkedin && (
                      <li>
                        <a
                          href={member.social.linkedin}
                          className="text-black hover:text-white transition-colors duration-400"
                        >
                          <FaLinkedin size={18} />
                        </a>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-center items-center h-full pt-12.5">
          <a
            href="#"
            className="font-bold uppercase text-lg mb-6.25 text-gray-700 hover:text-primary transition-colors duration-300"
          >
            Join Our Team
          </a>
        </div>
      </div>

      <style jsx>{`
        .group:hover .absolute.transition-transform:first-of-type {
          transform: rotateY(-180deg);
        }
        .group:hover .absolute.transition-transform:last-of-type {
          transform: rotateY(0deg);
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </section>
  );
};

export default OurTeam;
