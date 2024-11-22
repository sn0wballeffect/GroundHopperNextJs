import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export const Footer = () => {
  return (
    <footer className="mt-auto p-1 sm:p-2">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h3 className="text-xs sm:text-xl font-bold mb-2 sm:mb-0 text-center sm:text-left sm:ml-5">
          MosenGmbh®
        </h3>
        <div className="flex space-x-3 sm:space-x-10 mr-2 sm:mr-5">
          <a href="#" className="">
            <FaFacebook size={16} className="sm:w-6 sm:h-6" />
          </a>
          <a href="#" className="">
            <FaTwitter size={16} className="sm:w-6 sm:h-6" />
          </a>
          <a href="#" className="">
            <FaInstagram size={16} className="sm:w-6 sm:h-6" />
          </a>
          <a href="#" className="">
            <FaLinkedin size={16} className="sm:w-6 sm:h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
};
