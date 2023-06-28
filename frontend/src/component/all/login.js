import styles from '../all/login.module.css'
import React from 'react';

const login = () => {
  return (
    <div className={styles.container_div}>
      <form>
        <label className={styles["login-text"]}>כניסה למערכת</label>
  
        <div>
          <div className={styles["wave-group"]}>
            <input required type="text" className={styles.input} />
            <span className={styles.bar}></span>
            <label className={styles.label}>
              <span className={styles["label-char"]} style={{ "--index": 7 }}>ש</span>
              <span className={styles["label-char"]} style={{ "--index": 6 }}>מ</span>
              <span className={styles["label-char"]} style={{ "--index": 5 }}>ת</span>
              <span className={styles["label-char"]} style={{ "--index": 4 }}>ש</span>
              <span className={styles["label-char"]} style={{ "--index": 3 }}>מ</span>
              <span className={styles["label-char"]} style={{ "--index": 2 }}>&nbsp;</span>
              <span className={styles["label-char"]} style={{ "--index": 1 }}>ם</span>
              <span className={styles["label-char"]} style={{ "--index": 0 }}>ש</span>
            </label>
          </div>
        </div>
  
        <div>
          <div className={styles["wave-group"]}>
            <input required type="text" className={styles.input} />
            <span className={styles.bar}></span>
            <label className={styles.label}>
              <span className={styles["label-char"]} style={{ "--index": 4 }}>ה</span>
              <span className={styles["label-char"]} style={{ "--index": 3 }}>מ</span>
              <span className={styles["label-char"]} style={{ "--index": 2 }}>ס</span>
              <span className={styles["label-char"]} style={{ "--index": 1 }}>י</span>
              <span className={styles["label-char"]} style={{ "--index": 0 }}>ס</span>
            </label>
          </div>
        </div>
  
        <button type="submit">התחברות</button>
  
        {/* <div className={styles.register}>
          <button className={styles["register-btn"]}>להרשמה לחצו כאן</button>
          <label>אין עדיין חשבון?</label>
        </div> */}
      </form>
    </div>
  );
}

export default login;