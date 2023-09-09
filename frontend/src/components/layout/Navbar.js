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

const Navbar = (props) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const sidebarRef = useRef(null);

  useEffect(() => {
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
            <label className={styles.name_upper_sidebar}></label>
            {/* <img className={styles.avatar_img} src='avatar.png'></img> */}
          </div>

          <div className={styles.buttons_div}>
            <div className={styles.buttons_container}>

              <div className={styles.text_and_icon}>
                <FiUsers className={styles.icon}></FiUsers>
                <Link className={styles.links} to="/workers">
                  עובדים
                </Link>
              </div>

              <div className={styles.text_and_icon}>
                <RiLockPasswordLine className={styles.icon}></RiLockPasswordLine>
                <Link className={styles.links} to="/managerSettings">
                  שינוי פרטי משתמש
                </Link>
              </div>

              <div className={styles.text_and_icon}>
                <MdWorkOutline className={styles.icon}></MdWorkOutline>
                <Link className={styles.links} to="/roles">
                  תפקידים
                </Link>
              </div>

              <div className={styles.text_and_icon}>
                <AiOutlineLogout onClick={signout} className={styles.icon}></AiOutlineLogout>
                <label onClick={signout} className={styles.label}>
                  התנתקות מהמערכת
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
