import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { FiUsers } from 'react-icons/fi';
import { RiLockPasswordLine } from 'react-icons/ri';
import { MdWorkOutline } from 'react-icons/md';
import { AiOutlineLogout } from 'react-icons/ai';
import { AiOutlineSchedule } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { BsCardList } from "react-icons/bs";
import { TbUsersPlus } from "react-icons/tb";
import { AiOutlineClose } from "react-icons/ai";
import { BiTime } from "react-icons/bi";

const Navbar = (props) => {

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('')
  const [weekVisible, setWeekVisible] = useState(null);
  const [userGender, setUserGender] = useState(null)

  const sidebarRef = useRef(null);
  const blurBack = useRef(null);

    // get user from the local storage and return the user ID
    const getUser = () => {
      const user = localStorage.getItem('user');
      const userData = JSON.parse(user);
      setUserGender(userData.gender)
      return userData._id;
  };

  // get if nextWeek is visible or not
  const getDays = () => {
    const body2 = {
        id: getUser()
    }
    axios.post(`${process.env.REACT_APP_URL}/getNextWeek`, body2).then((response) => {
        setWeekVisible(response.data.visible)
    }).catch(() => {});
  }

  useEffect(() => {
    getDays();

    const StorageData = JSON.parse(localStorage.getItem("user"));
    setName(StorageData.fullName);

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // if next week isnt visible threw alert
  const handleWeekVisible = (event) => {
    event.preventDefault();

    if (!weekVisible) {
      console.log(weekVisible)
      Swal.fire({
        title: 'שיבוץ עובדים אפשרי רק לאחר יצירת ופרסום המשמרות',
        icon: 'warning',
        confirmButtonColor: '#34a0ff',
        confirmButtonText: 'סגירה'
      });         
    }
    else{
      navigate('/currentWeekShifts');
    }
  };

  const signout = () => {
    Swal.fire({
      title: 'האם ברצונכם להתנתק',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'ביטול',
      confirmButtonColor: '#34a0ff',
      cancelButtonColor: '#d33',
      confirmButtonText: 'אישור',
      customClass: {
        confirmButton: styles['confirm_button_class'],
        cancelButton: styles['cancel_button_class']
      },
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate('/');
      }
    });
  };
  

  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      sidebarRef.current.classList.add(styles.closed_sideBar);
      blurBack.current.classList.add(styles.closed_blur_back);

      setTimeout(() => {
        setOpen(false);
      }, 700);
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  };

  const handleCloseClick = () => {
    sidebarRef.current.classList.add(styles.closed_sideBar);
    blurBack.current.classList.add(styles.closed_blur_back);
  
    setTimeout(() => {
      setOpen(false);
    }, 700);
  };

  return (
    <div className={styles.nav_container}>
      <div className={styles.nav_btn_div}>
        <div onClick={() => setOpen((prev) => !prev)} className={styles.hamburger}>
          <img src="hamburger.svg" alt="Icon" />
        </div>
        <div className={styles.name}>{props.text}</div>
      </div>

      <div className={styles.spacer}></div>

      <div className={styles.logo_div}>
        <Link className={styles.logo} to="/managerHomePage">
          <img src="s_logo.png" alt="Logo" />
        </Link>
      </div>


      {open ? <div className={styles.blur_back} ref={blurBack}></div> : null}

      {open ? (
        <div className={styles.sideBar} ref={sidebarRef}>
          <div className={styles.upper_sidebar_div}>
            <AiOutlineClose onClick={handleCloseClick} className={styles.close_icon}></AiOutlineClose>
            {userGender === 'Famale' ? (
                <img
                src="female_avatar.png"
                style={{
                  width: "75px",
                  height: "80px",
                }}
              />
            ) : (
              <img
                src="male_avatar.png"
                style={{
                  width: "75px",
                  height: "80px",
                }}
              />
            )}
            <label className={styles.name_upper_sidebar}>{name}</label>
          </div>

          <div className={styles.buttons_div}>
            <div className={styles.buttons_container}>

              <div className={styles.text_and_icon}>
                <Link onClick={() => setOpen((prev) => !prev)} to="/SeeCurrentWeekShifts" className={styles.icon_link}>
                  <AiOutlineSchedule className={styles.icon}></AiOutlineSchedule>
                </Link>
                <Link onClick={() => setOpen((prev) => !prev)} className={styles.links} to="/SeeCurrentWeekShifts">
                  צפיה בשבוע הנוכחי
                </Link>
              </div>

              <div className={styles.text_and_icon}>
                <Link onClick={() => setOpen((prev) => !prev)} to="/editCurrentWeek" className={styles.icon_link}>
                  <BiEdit className={styles.icon}></BiEdit>
                </Link>
                <Link onClick={() => setOpen((prev) => !prev)} className={styles.links} to="/editCurrentWeek">
                  עדכון שבוע נוכחי
                </Link>
              </div>

              <hr className={styles.line}></hr>
              
              <div className={styles.text_and_icon}>
                <Link onClick={() => setOpen((prev) => !prev)} to="/createNewWeek" className={styles.icon_link}>
                <BsCardList className={styles.icon}></BsCardList>
                </Link>
                <Link onClick={() => setOpen((prev) => !prev)} className={styles.links} to="/createNewWeek">
                     יצירת משמרות לשבוע הבא
                </Link>
              </div>

              <div className={styles.text_and_icon}>
                <Link onClick={(e) => { handleWeekVisible(e); setOpen((prev) => !prev); }} className={styles.icon_link}>
                  <TbUsersPlus className={styles.icon}></TbUsersPlus>
                </Link>
                <Link className={styles.links} onClick={(e) => { handleWeekVisible(e); setOpen((prev) => !prev); }}>
                     שיבוץ עובדים לשבוע הבא
                </Link>
              </div>

              <hr className={styles.line}></hr>

              <div className={styles.text_and_icon}>
                <Link onClick={() => setOpen((prev) => !prev)} to="/workers" className={styles.icon_link}>
                  <FiUsers className={styles.icon}></FiUsers>
                </Link>
                <Link onClick={() => setOpen((prev) => !prev)} className={styles.links} to="/workers">
                  עובדים
                </Link>
              </div>

              <div className={styles.text_and_icon}>
                <Link onClick={() => setOpen((prev) => !prev)} className={styles.icon_link} to="/roles">
                  <MdWorkOutline className={styles.icon}></MdWorkOutline>
                </Link>
                <Link onClick={() => setOpen((prev) => !prev)} className={styles.links} to="/roles">
                  תפקידים
                </Link>
              </div>

              <div className={styles.text_and_icon}>
                <Link onClick={() => setOpen((prev) => !prev)} className={styles.icon_link} to="/defShifts">
                  <BiTime className={styles.icon}></BiTime>
                </Link>
                <Link onClick={() => setOpen((prev) => !prev)} className={styles.links} to="/defShifts">
                  משמרות
                </Link>
              </div>

              <hr className={styles.line}></hr>

              <div className={styles.text_and_icon}>
                <Link onClick={() => setOpen((prev) => !prev)} className={styles.icon_link} to="/managerSettings">
                  <RiLockPasswordLine className={styles.icon}></RiLockPasswordLine>
                </Link>
                <Link onClick={() => setOpen((prev) => !prev)} className={styles.links} to="/managerSettings">
                  עדכון פרטי משתמש
                </Link>
              </div>

              {/* <div className={styles.text_and_icon}>
                <Link onClick={() => setOpen((prev) => !prev)} className={styles.icon_link} to="/settingsPage">
                  <AiOutlineSetting className={styles.icon}></AiOutlineSetting>
                </Link>
                <Link onClick={() => setOpen((prev) => !prev)} className={styles.links} to="/settingsPage">
                  הגדרות
                </Link>
              </div> */}

              <hr className={styles.line}></hr>

              <div className={styles.text_and_icon}>
                <AiOutlineLogout onClick={signout} className={styles.icon}></AiOutlineLogout>
                <label onClick={signout} className={styles.label}>
                  התנתקות 
                </label>
              </div>

            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Navbar;
