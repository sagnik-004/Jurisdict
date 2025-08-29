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
      transition={{ duration: 0.5 }}
      className={`flex justify-between items-start rounded-xl p-10 w-full mx-auto border ${darkMode ? 'bg-slate-800 border-slate-700 shadow-lg shadow-white/10' : 'bg-slate-50 border-slate-200 shadow-lg shadow-black/5'}`}
    >
      <div className="w-2/5 pr-8">
        <h2 className="text-2xl font-semibold mb-4">
          Contact Us
        </h2>
        <p className={`mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Our mailing address is:
        </p>
        <p className={`mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          152A Charlotte Street, Peterborough ON
        </p>
        <p className={`font-semibold mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Phone: 705-742-3221
        </p>
        <div className="flex gap-4">
          {[
            { icon: <Facebook size={20} /> },
            { icon: <Twitter size={20} /> },
            { icon: <Instagram size={20} /> },
            { icon: <Linkedin size={20} /> },
          ].map((social, index) => (
            <motion.a
              key={index}
              href="#"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`${darkMode ? 'text-slate-400 hover:text-indigo-400' : 'text-slate-600 hover:text-indigo-500'} transition-colors`}
            >
              {social.icon}
            </motion.a>
          ))}
        </div>
      </div>

      <div className="w-3/5">
        <p className={`mb-6 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          <strong className={`block mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-800'}`}>
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
            className={`w-full px-4 py-3 rounded-lg border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-100 focus:ring-indigo-500/20' : 'bg-white border-slate-300 text-slate-800'}`}
            required
          />
          
          <input
            type="email"
            name="email"
            placeholder="Enter a valid email address"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-100 focus:ring-indigo-500/20' : 'bg-white border-slate-300 text-slate-800'}`}
            required
          />
          
          <textarea
            name="message"
            placeholder="Enter your message"
            value={formData.message}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-lg border focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all min-h-[120px] resize-y ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-100 focus:ring-indigo-500/20' : 'bg-white border-slate-300 text-slate-800'}`}
            required
          />
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-medium self-start mt-2"
          >
            Submit
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
};

export default ContactForm;