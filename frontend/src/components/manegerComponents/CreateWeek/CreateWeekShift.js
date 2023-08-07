import React, { useEffect, useState } from "react";
import styles from './createWeek.module.css'
import Swal from 'sweetalert2';
import moment from "moment";

const CreateWeekShift = (props) => {

    const [shift, setShift] = useState(props.shift);

    const startTimeHours = moment(shift.startTime, 'HH:mm').format('HH:mm');
    const endTimeHours = moment(shift.endTime, 'HH:mm').format('HH:mm');

    const deleteShift = () => {
        Swal.fire({
            title: 'האם ברצונך למחוק את המשמרת',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText : 'ביטול',
            confirmButtonColor: '#2977bc',
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
              {shift.description}: {moment(shift.endTime).format('HH:mm')} - {moment(shift.startTime).format('HH:mm')}
          </p>
          <button className={styles.btn_delete} onClick={deleteShift}>
              מחיקת משמרת
          </button>
      </div>
  );
  
}

export default CreateWeekShift