import React from "react";

// Note: Assuming 'bg-linear-to-br from-red-600 to-pink-800' is defined in your Tailwind config.

const OptionCard = () => {
  return (
    <section className="relative py-14 bg-gray-50">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Responsive Grid Change: grid-cols-1 (default) -> sm:grid-cols-2 (phones/tablets) -> lg:grid-cols-3 (desktop) */}
        <div className="grid grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-8 lg:gap-12">
          {/* Feature 1: All Certificates */}
          <div className="text-center space-y-3 md:space-y-4 lg:space-y-6 p-2 md:p-4 lg:p-8">
            <div className="w-16 h-16 bg-linear-to-br from-red-600 to-pink-800 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              {/* Icon: Security Shield/Certificate */}
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-sm md:text-lg pt-2 font-semibold text-gray-900">
              All Certificates
            </h3>
            <p className="text-sm  font-light text-gray-600 leading-relaxed">
              Access and verify the full certification documents for every
              purchase.
            </p>
          </div>

          {/* Feature 2: 24/7 Chat Support */}
          <div className="text-center space-y-2 md:space-y-4 lg:space-y-6 p-2 md:p-4 lg:p-8">
            <div className="w-16 h-16 bg-linear-to-br from-red-600 to-pink-800 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              {/* Icon: Chat Bubble */}
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z"
                />
              </svg>
            </div>
            <h3 className="text-sm md:text-lg pt-2 font-semibold text-gray-900">
              24/7 Chat Support
            </h3>
            <p className="text-sm  font-light text-gray-600 leading-relaxed">
              Immediate assistance from our experts, available anytime via live
              chat.
            </p>
          </div>

          {/* Feature 3: Schedule a Private Meeting */}
          <div className="text-center space-y-2 md:space-y-4 lg:space-y-6 p-2 md:p-4 lg:p-8">
            <div className="w-16 h-16 bg-linear-to-br from-red-600 to-pink-800 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              {/* Icon: Calendar/Schedule */}
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-4 9v4m-4-2h8m-4 2h8a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h4"
                />
              </svg>
            </div>
            <h3 className="text-sm md:text-lg pt-2 font-semibold text-gray-900">
              Schedule a Meeting
            </h3>
            <p className="text-sm  font-light text-gray-600 leading-relaxed">
              Book a virtual or in-person consultation with a gem specialist
              today.
            </p>
          </div>

          {/* Ai Support for Gems setting */}
          <div className="text-center space-y-2 md:space-y-4 lg:space-y-6 p-2 md:p-4 lg:p-8">
            <div className="w-16 h-16 bg-linear-to-br from-red-600 to-pink-800 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
              {/* Icon: Calendar/Schedule */}
              <svg
                viewBox="0 0 512 512"
                version="1.1"
                fill="#ffffff"
                className="w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <title>ai</title>
                  <g
                    id="Page-1"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      id="icon"
                      fill="#ffffff"
                      fillRule="nonzero"
                      transform="translate(64.000000, 64.000000)"
                    >
                      <path
                        d="M320,64 L320,320 L64,320 L64,64 L320,64 Z M171.749388,128 L146.817842,128 L99.4840387,256 L121.976629,256 L130.913039,230.977 L187.575039,230.977 L196.319607,256 L220.167172,256 L171.749388,128 Z M260.093778,128 L237.691519,128 L237.691519,256 L260.093778,256 L260.093778,128 Z M159.094727,149.47526 L181.409039,213.333 L137.135039,213.333 L159.094727,149.47526 Z M341.333333,256 L384,256 L384,298.666667 L341.333333,298.666667 L341.333333,256 Z M85.3333333,341.333333 L128,341.333333 L128,384 L85.3333333,384 L85.3333333,341.333333 Z M170.666667,341.333333 L213.333333,341.333333 L213.333333,384 L170.666667,384 L170.666667,341.333333 Z M85.3333333,0 L128,0 L128,42.6666667 L85.3333333,42.6666667 L85.3333333,0 Z M256,341.333333 L298.666667,341.333333 L298.666667,384 L256,384 L256,341.333333 Z M170.666667,0 L213.333333,0 L213.333333,42.6666667 L170.666667,42.6666667 L170.666667,0 Z M256,0 L298.666667,0 L298.666667,42.6666667 L256,42.6666667 L256,0 Z M341.333333,170.666667 L384,170.666667 L384,213.333333 L341.333333,213.333333 L341.333333,170.666667 Z M0,256 L42.6666667,256 L42.6666667,298.666667 L0,298.666667 L0,256 Z M341.333333,85.3333333 L384,85.3333333 L384,128 L341.333333,128 L341.333333,85.3333333 Z M0,170.666667 L42.6666667,170.666667 L42.6666667,213.333333 L0,213.333333 L0,170.666667 Z M0,85.3333333 L42.6666667,85.3333333 L42.6666667,128 L0,128 L0,85.3333333 Z"
                        id="Combined-Shape"
                      />
                    </g>
                  </g>
                </g>
              </svg>
            </div>
            <h3 className="text-sm md:text-lg pt-2 font-semibold text-gray-900">
              AI Support
            </h3>
            <p className="text-sm  font-light text-gray-600 leading-relaxed">
              Get personalized insights and recommendations from our AI-powered
              chatbot.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OptionCard;
