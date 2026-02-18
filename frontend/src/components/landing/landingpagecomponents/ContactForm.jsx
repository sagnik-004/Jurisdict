import { useState } from "react";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const ContactForm = ({ darkMode }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className={`relative overflow-hidden flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8 lg:gap-0 rounded-xl p-6 md:p-10 w-full mx-auto border ${
        darkMode
          ? "bg-slate-800/90 border-slate-700 shadow-lg shadow-white/10 backdrop-blur-sm"
          : "bg-white/90 border-slate-200 shadow-lg shadow-teal-500/5 backdrop-blur-sm"
      }`}
    >
      <div
        className={`absolute inset-0 pointer-events-none ${
          darkMode
            ? "bg-gradient-to-br from-slate-900/20 to-teal-900/10"
            : "bg-gradient-to-br from-teal-50/20 to-cyan-50/10"
        }`}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, ${
              darkMode ? "rgba(6, 182, 212, 0.1)" : "rgba(6, 182, 212, 0.05)"
            } 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${
              darkMode ? "rgba(20, 184, 166, 0.1)" : "rgba(20, 184, 166, 0.05)"
            } 0%, transparent 50%)`,
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="relative w-full lg:w-2/5 lg:pr-8"
      >
        <h2
          className={`text-xl md:text-2xl font-semibold mb-4 ${
            darkMode ? "text-white" : "text-slate-900"
          }`}
        >
          Contact Us
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className={`mb-2 ${darkMode ? "text-slate-400" : "text-slate-600"}`}
        >
          Our mailing address is:
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className={`mb-4 ${darkMode ? "text-slate-400" : "text-slate-600"}`}
        >
          Remote, Remote St.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className={`font-semibold mb-6 ${
            darkMode ? "text-slate-400" : "text-slate-600"
          }`}
        >
        </motion.p>
        <div className="flex gap-4">
          {[
            <Facebook key="fb" size={20} className="text-teal-500" />,
            <Twitter key="tw" size={20} className="text-teal-500" />,
            <Instagram key="ig" size={20} className="text-teal-500" />,
            <Linkedin key="li" size={20} className="text-teal-500" />,
          ].map((icon, index) => (
            <a
              key={index}
              href="#"
              className="p-2 rounded-full bg-gradient-to-r from-teal-400/10 to-cyan-500/10 hover:from-teal-400/20 hover:to-cyan-500/20 border border-teal-500/20 hover:border-teal-500/40 transition-all duration-150 hover:scale-110"
            >
              {icon}
            </a>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="relative w-full lg:w-3/5"
      >
        <p
          className={`mb-6 leading-relaxed ${
            darkMode ? "text-slate-400" : "text-slate-600"
          }`}
        >
          <strong
            className={`block mb-2 ${
              darkMode ? "text-slate-300" : "text-slate-800"
            }`}
          >
            Great vision without great people is irrelevant.
          </strong>
          Let's work together.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Enter your Name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all ${
              darkMode
                ? "bg-slate-900 border-slate-700 text-slate-100 focus:ring-teal-400/30"
                : "bg-white border-slate-300 text-slate-800"
            }`}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter a valid email address"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border focus:border-teal-400 focus:ring-2 focus:ring-teal-400/20 outline-none transition-all ${
              darkMode
                ? "bg-slate-900 border-slate-700 text-slate-100 focus:ring-teal-400/30"
                : "bg-white border-slate-300 text-slate-800"
            }`}
            required
          />

          <textarea
            name="message"
            placeholder="Enter your message"
            value={formData.message}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border focus:border-[#14b8a6] focus:ring-2 focus:ring-[#14b8a6]/20 outline-none transition-all min-h-[120px] resize-y ${
              darkMode
                ? "bg-slate-900 border-slate-700 text-slate-100 focus:ring-[#14b8a6]/30"
                : "bg-white border-slate-300 text-slate-800"
            }`}
            required
          />

          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 text-white rounded-lg font-medium self-start mt-2 transition-all duration-150 shadow-lg shadow-teal-500/25 hover:shadow-xl hover:shadow-teal-500/30"
          >
            Submit
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ContactForm;
