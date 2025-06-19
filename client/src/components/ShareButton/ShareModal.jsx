// ShareModal.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { IoClose, IoCopy } from "react-icons/io5";

export const ShareModal = ({
  onClose,
  imageUrl,
  taskName = "",
  streak = 0,
}) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768); // Check for mobile/tablet view

  // Add resize listener
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const shareText = `🔥 Day ${streak} of my "${taskName}" streak!\n\nKeeping the momentum going with daily progress and achievements. #PersonalGrowth #Consistency`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopySuccess(true);
      toast.success("Text copied to clipboard!");
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      toast.error("Failed to copy text");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Share Your Achievement
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                Share your {streak}-day streak for "{taskName}" with your
                network!
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <IoClose className="w-6 h-6" />
            </motion.button>
          </div>

          {/* Main Content */}
          <div className="flex flex-col md:flex-row gap-6 overflow-auto">
            {/* Left Column - Screenshot and Download Button */}
            <div className="flex-1 min-w-0">
              {!isMobile && imageUrl && (
                <div className="relative rounded-lg overflow-hidden shadow-lg mb-4">
                  <img
                    src={imageUrl}
                    alt={`${taskName} streak progress`}
                    className="w-full"
                  />
                </div>
              )}

              {/* Download Button */}
              <button
                onClick={async () => {
                  try {
                    if (imageUrl) {
                      const link = document.createElement("a");
                      link.href = imageUrl;
                      link.download = `${taskName}-streak-progress.png`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);

                      if (isMobile) {
                        toast.success(
                          "Screenshot captured! Image downloaded successfully!"
                        );
                      } else {
                        toast.success("Image downloaded successfully!");
                      }
                    }
                  } catch (error) {
                    console.error("Download failed:", error);
                    toast.error("Failed to download image. Please try again.");
                  }
                }}
                className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              >
                Download Image
              </button>
            </div>

            {/* Right Column - Share Text, Instructions, and Buttons */}
            <div className="md:w-72 space-y-4">
              {/* Share Text */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Share Text
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="text-blue-600 text-sm hover:text-blue-700 flex items-center gap-1"
                  >
                    <IoCopy className="w-4 h-4" />
                    {copySuccess ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-gray-600 text-sm whitespace-pre-line">
                  {shareText}
                </p>
              </div>

              {/* LinkedIn Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">
                  Sharing Steps
                </h4>
                <ol className="text-sm text-blue-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-blue-800 font-medium shrink-0">
                      1
                    </span>
                    <span>Copy the text above</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-blue-800 font-medium shrink-0">
                      2
                    </span>
                    <span>Download the image</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-blue-800 font-medium shrink-0">
                      3
                    </span>
                    <span>
                      Click "Share on LinkedIn" and attach the image to your
                      post
                    </span>
                  </li>
                </ol>
              </div>

              {/* Share Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => {
                    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      window.location.href
                    )}&title=${encodeURIComponent(shareText)}`;
                    window.open(linkedInUrl, "_blank");
                    toast.success(
                      "LinkedIn post prepared! Don't forget to attach the downloaded image."
                    );
                  }}
                  className="w-full py-3 bg-[#0A66C2] text-white rounded-lg font-medium hover:bg-[#004182] transition-colors flex items-center justify-center gap-2"
                >
                  Share on LinkedIn
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShareModal;

// // ShareModal.jsx
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";
// import { IoClose, IoCopy } from "react-icons/io5";

// export const ShareModal = ({
//   onClose,
//   imageUrl,
//   taskName = "",
//   streak = 0,
// }) => {
//   const [copySuccess, setCopySuccess] = useState(false);

//   const shareText = `🔥 Day ${streak} of my "${taskName}" streak!\n\nKeeping the momentum going with daily progress and achievements. #PersonalGrowth #Consistency`;

//   const copyToClipboard = async () => {
//     try {
//       await navigator.clipboard.writeText(shareText);
//       setCopySuccess(true);
//       toast.success("Text copied to clipboard!");
//       setTimeout(() => setCopySuccess(false), 2000);
//     } catch (err) {
//       toast.error("Failed to copy text");
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
//       onClick={onClose}
//     >
//       <motion.div
//         initial={{ scale: 0.95, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.95, opacity: 0 }}
//         className="bg-white rounded-xl p-6 w-full max-w-5xl max-h-[90vh] overflow-hidden"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <div className="flex flex-col h-full">
//           {/* Header */}
//           <div className="flex justify-between items-start mb-6">
//             <div>
//               <h3 className="text-xl font-bold text-gray-800">
//                 Share Your Achievement
//               </h3>
//               <p className="text-gray-600 text-sm mt-1">
//                 Share your {streak}-day streak for "{taskName}" with your
//                 network!
//               </p>
//             </div>
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={onClose}
//               className="text-gray-400 hover:text-gray-600"
//             >
//               <IoClose className="w-6 h-6" />
//             </motion.button>
//           </div>

//           {/* Main Content - Two Columns */}
//           <div className="flex flex-col md:flex-row gap-6 overflow-auto">
//             {/* Left Column - Image and Text */}
//             <div className="flex-1 min-w-0">
//               {imageUrl && (
//                 <div className="relative rounded-lg overflow-hidden shadow-lg mb-4">
//                   <img
//                     src={imageUrl}
//                     alt={`${taskName} streak progress`}
//                     className="w-full"
//                   />
//                 </div>
//               )}

//               {/* Share Text */}
//               <div className="bg-gray-50 rounded-lg p-4">
//                 <div className="flex justify-between items-center mb-2">
//                   <span className="text-sm font-medium text-gray-700">
//                     Share Text
//                   </span>
//                   <button
//                     onClick={copyToClipboard}
//                     className="text-blue-600 text-sm hover:text-blue-700 flex items-center gap-1"
//                   >
//                     <IoCopy className="w-4 h-4" />
//                     {copySuccess ? "Copied!" : "Copy"}
//                   </button>
//                 </div>
//                 <p className="text-gray-600 text-sm whitespace-pre-line">
//                   {shareText}
//                 </p>
//               </div>
//             </div>

//             {/* Right Column - Instructions and Buttons */}
//             <div className="md:w-72 space-y-4">
//               {/* LinkedIn Instructions */}
//               <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
//                 <h4 className="font-semibold text-blue-800 mb-2">
//                   Sharing Steps
//                 </h4>
//                 <ol className="text-sm text-blue-600 space-y-2">
//                   <li className="flex items-start gap-2">
//                     <span className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-blue-800 font-medium shrink-0">
//                       1
//                     </span>
//                     <span>Copy the text above</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-blue-800 font-medium shrink-0">
//                       2
//                     </span>
//                     <span>Download the image</span>
//                   </li>
//                   <li className="flex items-start gap-2">
//                     <span className="bg-blue-200 rounded-full w-5 h-5 flex items-center justify-center text-blue-800 font-medium shrink-0">
//                       3
//                     </span>
//                     <span>
//                       Click "Share on LinkedIn" and attach the image to your
//                       post
//                     </span>
//                   </li>
//                 </ol>
//               </div>

//               {/* Action Buttons */}
//               <div className="space-y-3">
//                 <button
//                   onClick={async () => {
//                     try {
//                       if (imageUrl) {
//                         const link = document.createElement("a");
//                         link.href = imageUrl;
//                         link.download = `${taskName}-streak-progress.png`;
//                         document.body.appendChild(link);
//                         link.click();
//                         document.body.removeChild(link);
//                         toast.success("Image downloaded successfully!");
//                       }
//                     } catch (error) {
//                       console.error("Download failed:", error);
//                       toast.error(
//                         "Failed to download image. Please try again."
//                       );
//                     }
//                   }}
//                   className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
//                 >
//                   Download Image
//                 </button>

//                 <button
//                   onClick={() => {
//                     const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
//                       window.location.href
//                     )}&title=${encodeURIComponent(shareText)}`;
//                     window.open(linkedInUrl, "_blank");
//                     toast.success(
//                       "LinkedIn post prepared! Don't forget to attach the downloaded image."
//                     );
//                   }}
//                   className="w-full py-3 bg-[#0A66C2] text-white rounded-lg font-medium hover:bg-[#004182] transition-colors flex items-center justify-center gap-2"
//                 >
//                   Share on LinkedIn
//                 </button>

//                 <button
//                   onClick={onClose}
//                   className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// };

// export default ShareModal;
