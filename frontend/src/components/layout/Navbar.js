import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { RxHamburgerMenu } from 'react-icons/rx';
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

const Navbar = (props) => {

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [name, setName] = useState('')

  const sidebarRef = useRef(null);

  useEffect(() => {
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
        <Link className={styles.logo} to="/managerHomePage">
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
                <Link to="/currentWeekShifts" className={styles.icon_link}>
                  <TbUsersPlus className={styles.icon}></TbUsersPlus>
                </Link>
                <Link className={styles.links} to="/currentWeekShifts">
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
