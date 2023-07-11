import React, { useEffect, useState } from "react";
import styles from './createWeek.module.css'
import Swal from 'sweetalert2';

const CreateWeekShift = (props) => {

    const [shift, setShift] = useState(props.shift);

    const deleteShift = () => {
        Swal.fire({
            title: 'האם אתה בטוח שברצונך למחוק את המשמרת',
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
                confirmButtonText: 'אישור'
              })
              props.deleteShift(shift._id);
            }
          })

    }

    return <div className={styles.shift}>
        <p className={styles.shift_description}>{shift.description}: {shift.startTime} - {shift.endTime}</p>
        <button className={styles.btn_delete} onClick={deleteShift}>מחיקת משמרת</button>
    </div>
}

export default CreateWeekShift