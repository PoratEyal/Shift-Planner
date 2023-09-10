import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { RxHamburgerMenu } from 'react-icons/rx';
import { RiLockPasswordLine } from 'react-icons/ri';
import { AiOutlineLogout } from 'react-icons/ai';
import { TbUsersPlus } from "react-icons/tb";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineSchedule } from "react-icons/ai";

const NavbarWroker = (props) => {

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState('')
  const sidebarRef = useRef(null);
  const [weekVisible, setWeekVisible] = useState(null);
  const [weekPublished, setWeekPublished] = useState(null);

  // return the manager Id of the current user
  const getUser = () => {
      const user = localStorage.getItem('user');
      const userData = JSON.parse(user);
      return userData.manager;
  };

  // get days of the current week
  // get if nextWeek is visible or not
  const getDays = () => {
      const body2 = {
          id: getUser()
      }
      axios.post(`${process.env.REACT_APP_URL}/getNextWeek`, body2).then((response) => {
          setWeekVisible(response.data.visible)
          setWeekPublished(response.data.publishScheduling)
      }).catch(err=> console.log(err));
  }

  // if next week isnt visible threw alert
  const ChooseShiftsHandler = () => {
      weekVisible ? navigate("/chooseShifts") 
      : Swal.fire({
          title: 'טרם פורסמו משמרות',
          icon: 'warning',
          confirmButtonColor: '#34a0ff',
          confirmButtonText: 'סגור'
        })
  }

  useEffect(() => {
    getDays();

    const StorageData = JSON.parse(localStorage.getItem("user"));
    setName(StorageData.fullName);

    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        navigate('./');
      }
    });
  };

  return (
    <div className={styles.nav_container}>
      <div className={styles.nav_btn_div}>
        <div onClick={() => setOpen((prev) => !prev)} className={styles.hamburger}>
          <RxHamburgerMenu></RxHamburgerMenu>
        </div>
        <div className={styles.name}>{props.text}</div>
      </div>

      <div className={styles.spacer}></div>

      <div className={styles.nav_btn_div}>
        <Link className={styles.logo} to="/CurrentWeek">
          <img src="s_logo.png" alt="Logo"></img>
        </Link>
      </div>

      {open ? <div className={styles.blur_back}></div> : null}

      {open ? (
        <div className={styles.sideBar} ref={sidebarRef}>
          <div className={styles.upper_sidebar_div}>
            <AiOutlineClose onClick={() => setOpen((prev) => !prev)} className={styles.close_icon}></AiOutlineClose>
            <img
              src="avatar.png"
              style={{
                width: "60px",
                height: "60px",
              }}
            />
            <label className={styles.name_upper_sidebar}>{name}</label>
          </div>

          <div className={styles.buttons_div}>
            <div style={{marginTop: '-25px'}} className={styles.buttons_container}>

              <div className={styles.text_and_icon}>
                <Link to="/CurrentWeek" className={styles.icon_link}>
                  <AiOutlineSchedule className={styles.icon}></AiOutlineSchedule>
                </Link>
                <Link className={styles.links} to="/CurrentWeek">
                  סידור עבודה לשבוע הנוכחי
                </Link>
              </div>

              <hr className={styles.line}></hr>

              <div className={styles.text_and_icon}>
                <Link onClick={ChooseShiftsHandler} className={styles.icon_link}>
                  <TbUsersPlus className={styles.icon}></TbUsersPlus>
                </Link>
                <Link className={styles.links} onClick={ChooseShiftsHandler}>
                  {weekPublished ? (
                    <>צפיה במשמרות לשבוע הבא</>
                  ) : (
                    <>בחירת משמרות לשבוע הבא</>
                  )}
                </Link>
              </div>

              <hr className={styles.line}></hr>

              <div className={styles.text_and_icon}>
                <Link className={styles.icon_link} to="/userSettings">
                  <RiLockPasswordLine className={styles.icon}></RiLockPasswordLine>
                </Link>
                <Link className={styles.links} to="/userSettings">
                  עדכון פרטי משתמש
                </Link>
              </div>

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

export default NavbarWroker;
