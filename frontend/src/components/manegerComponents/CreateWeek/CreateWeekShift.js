import React, { useEffect, useState } from "react";
import styles from './createWeek.module.css'
import Swal from 'sweetalert2';
import moment from "moment";

const CreateWeekShift = (props) => {

    const [shift, setShift] = useState(props.shift);

    const deleteShift = () => {
        Swal.fire({
            title: 'האם ברצונך למחוק את המשמרת',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText : 'ביטול',
            confirmButtonColor: '#34a0ff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'מחיקה'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: 'המשמרת נמחקה',
                icon: 'success',
                confirmButtonColor: '#2977bc',
                confirmButtonText: 'סגירה'
              })
              props.deleteShift(shift._id);
            }
          })

    }
    
    return (
      <div className={styles.shift}>
          <p className={styles.shift_description}>
              {shift.description}&nbsp;: {moment(shift.endTime).format('HH:mm')} - {moment(shift.startTime).format('HH:mm')}
          </p>
          <button className={styles.btn_delete} onClick={deleteShift}>
              מחיקת משמרת
          </button>
      </div>
  );
  
}

export default CreateWeekShift