import { useEffect, useRef, useState } from "react";

//addomg proper icon for the info button 
import { HelpCircle } from "lucide-react";

//reusable info button component.
export default function InfoButton({ title, children }) {
// state to track if the info popup is open or closed
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  //close popup if clicked outsude of it.
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    // listen for clicks on whole page
    document.addEventListener("mousedown", handleClickOutside);

    // clean up (remove listener when component is gone)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // -------------------- UI --------------------
  return (
    <span className="info-button-wrapper" ref={wrapperRef}>
    {/* button */}
      <button
        type="button"
        className="info-button"
        aria-label={`More information about ${title}`}
        onClick={() => setOpen((prev) => !prev)}
    >
        <HelpCircle size={15} strokeWidth={2} />
        </button>  
         {/* popup (only shows if open = true) */} 
      {open && (
        <div className="info-popup" role="dialog" aria-label={title}>
            <div className="info-popup-content">{children}</div> {/* text passed intp the button */}
        </div>
        )}
    </span>
  );
}


//creates one reusable (i) button
//opens a popup box when clicked
//closes when clicked again
//also closes if the user clicks anywhere outside it