import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import styles from "./shiftPage.module.css";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiEditAlt } from "react-icons/bi";
import { FiMoreHorizontal } from "react-icons/fi";
import PopUpEditShift from "../../popups/updateShift/popUpUpdateShift";

const DefaultShift = (props) => {

  const [shift, setShift] = useState(props.shift);
  const [clickAddShift, setClickAddShift] = useState(false);
  const [openOptions, setOpenOptions] = useState(null);
  const [isDivVisible, setDivVisible] = useState(false);
  const [isBackdropVisible, setIsBackdropVisible] = useState(false);
  const divRef = useRef(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const toggleBackdrop = () => {
    setIsBackdropVisible(!isBackdropVisible);
  };

  // control on the close and open the option select
  useEffect(() => {
    setShift(props.shift);

    function handleOutsideClick(event) {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setDivVisible(false);
        setClickAddShift(false); // Close the PopUpEditShift component and remove backdrop class
      }
    }

    if (isDivVisible) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isDivVisible]);

  // when click on the ... icon - set those two states
  const options = (shiftId) => {
    setOpenOptions(shiftId);
    setDivVisible(true);
  };

  return (
    <React.Fragment>
      <div className={styles.shift_container}>
        <div className={styles.description}>
          {moment(shift.endTime).utc().format("HH:mm")} -{" "}
          {moment(shift.startTime).utc().format("HH:mm")} : {shift.description}
        </div>

        <div className={styles.delete_edit_div}>
          <FiMoreHorizontal
            className={styles.icon}
            onClick={() => options(shift._id)}
          ></FiMoreHorizontal>

          {openOptions === shift._id && isDivVisible ? (
            <div ref={divRef} className={styles.edit_div_options}>
              <div className={styles.edit_div_flex}>
                <label
                  onClick={() => {
                    setClickAddShift(!clickAddShift);
                    setDivVisible(false);
                  }}
                >
                  עריכת משמרת
                </label>
                <BiEditAlt
                  className={styles.icon_edit_select}
                  onClick={() => {
                    setClickAddShift(!clickAddShift);
                    setDivVisible(false);
                  }}
                ></BiEditAlt>
              </div>

              <div className={styles.edit_div_flex}>
                <label
                  onClick={() => {
                    props.delete(shift._id);
                    setDivVisible(false);
                  }}
                >
                  מחיקת משמרת
                </label>
                <RiDeleteBin6Line
                  className={styles.icon_edit_select}
                  onClick={() => {
                    props.delete(shift._id);
                    setDivVisible(false);
                  }}
                ></RiDeleteBin6Line>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {clickAddShift && (
        <React.Fragment>
          <div className={`${styles.backdrop} ${isBackdropVisible ? styles.visible : ''}`} onClick={() => {setClickAddShift(false); toggleBackdrop();}}></div>
          <PopUpEditShift
            userId={user._id}
            shiftId={shift._id}
            name={shift.description}
            startTime={shift.startTime}
            endTime={shift.endTime}
            amountOfWorkers={shift.amountOfWorkers}
            onClose={() => {setClickAddShift(false); toggleBackdrop();}}
          ></PopUpEditShift>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default DefaultShift;