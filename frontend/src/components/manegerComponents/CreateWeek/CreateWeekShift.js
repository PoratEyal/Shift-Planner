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
            confirmButtonColor: '#332891e1',
            cancelButtonColor: '#d33',
            confirmButtonText: 'מחיקה'
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire(
                'המשמרת נמחקה',
                '',
                'success'
              )
              props.deleteShift(shift._id);
            }
          })

    }

    return <div className={styles.shift}>
        <p className={styles.shift_name}>{shift.description}</p>
        <p>משעה - {shift.startTime} עד {shift.endTime}</p>
        <button className={styles.btn_delete} onClick={deleteShift}>מחיקת משמרת</button>
    </div>
}

export default CreateWeekShift