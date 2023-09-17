import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { RxHamburgerMenu } from 'react-icons/rx';
import { FiUsers } from 'react-icons/fi';
import { RiLockPasswordLine } from 'react-icons/ri';
import { MdWorkOutline } from 'react-icons/md';
import { AiOutlineLogout } from 'react-icons/ai';
import { AiOutlineSchedule } from "react-icons/ai";
import { BiEdit } from "react-icons/bi";
import { BsCardList } from "react-icons/bs";
import { TbUsersPlus } from "react-icons/tb";
import { AiOutlineClose } from "react-icons/ai";
import { AiOutlineSetting } from "react-icons/ai";
import { BiTime } from "react-icons/bi";

const Navbar = (props) => {

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('')
  const [weekVisible, setWeekVisible] = useState(null);

  const sidebarRef = useRef(null);
  const blurBack = useRef(null);

    // get user from the local storage and return the user ID
    const getUser = () => {
      const user = localStorage.getItem('user');
      const userData = JSON.parse(user);
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
        confirmButtonColor: '#3085d6',
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
          <RxHamburgerMenu></RxHamburgerMenu>
        </div>
        <div className={styles.name}>{props.text}</div>
      </div>

      <div className={styles.spacer}></div>

      <div className={styles.nav_btn_div}>
        <Link className={styles.logo} to="/managerHomePage">
          <img src="s_logo.png" alt="Logo"></img>
        </Link>
      </div>

      {open ? <div className={styles.blur_back} ref={blurBack}></div> : null}

      {open ? (
        <div className={styles.sideBar} ref={sidebarRef}>
          <div className={styles.upper_sidebar_div}>
            <AiOutlineClose onClick={handleCloseClick} className={styles.close_icon}></AiOutlineClose>
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
            <div className={styles.buttons_container}>

              <div className={styles.text_and_icon}>
                <Link to="/SeeCurrentWeekShifts" className={styles.icon_link}>
                  <AiOutlineSchedule className={styles.icon}></AiOutlineSchedule>
                </Link>
                <Link className={styles.links} to="/SeeCurrentWeekShifts">
                  צפיה בשבוע הנוכחי
                </Link>
              </div>

              <div className={styles.text_and_icon}>
                <Link to="/editCurrentWeek" className={styles.icon_link}>
                  <BiEdit className={styles.icon}></BiEdit>
                </Link>
                <Link className={styles.links} to="/editCurrentWeek">
                  עדכון שבוע נוכחי
                </Link>
              </div>

              <hr className={styles.line}></hr>
              
              <div className={styles.text_and_icon}>
                <Link to="/createNewWeek" className={styles.icon_link}>
                  <BsCardList className={styles.icon}></BsCardList>
                </Link>
                <Link className={styles.links} to="/createNewWeek">
                     יצירת משמרות לשבוע הבא
                </Link>
              </div>

              <div className={styles.text_and_icon}>
                <Link onClick={(e) => handleWeekVisible(e)} className={styles.icon_link}>
                  <TbUsersPlus className={styles.icon}></TbUsersPlus>
                </Link>
                <Link className={styles.links} onClick={(e) => handleWeekVisible(e)}>
                     שיבוץ עובדים לשבוע הבא
                </Link>
              </div>

              <hr className={styles.line}></hr>

              <div className={styles.text_and_icon}>
                <Link to="/workers" className={styles.icon_link}>
                  <FiUsers className={styles.icon}></FiUsers>
                </Link>
                <Link className={styles.links} to="/workers">
                  עובדים
                </Link>
              </div>

              <div className={styles.text_and_icon}>
                <Link className={styles.icon_link} to="/roles">
                  <MdWorkOutline className={styles.icon}></MdWorkOutline>
                </Link>
                <Link className={styles.links} to="/roles">
                  תפקידים
                </Link>
              </div>

              <div className={styles.text_and_icon}>
                <Link className={styles.icon_link} to="/settings">
                  <BiTime className={styles.icon}></BiTime>
                </Link>
                <Link className={styles.links} to="/settings">
                  משמרות
                </Link>
              </div>

              <hr className={styles.line}></hr>

              <div className={styles.text_and_icon}>
                <Link className={styles.icon_link} to="/managerSettings">
                  <RiLockPasswordLine className={styles.icon}></RiLockPasswordLine>
                </Link>
                <Link className={styles.links} to="/managerSettings">
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

export default Navbar;
