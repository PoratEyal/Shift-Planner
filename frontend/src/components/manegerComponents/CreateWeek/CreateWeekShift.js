import React, { useEffect, useState } from "react";
import styles from './createWeek.module.css'
import Swal from 'sweetalert2';
import moment from "moment";
import { RiDeleteBin6Line } from "react-icons/ri";

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
        <div className={styles.createShift_div}>
          <button className={styles.btn_delete} onClick={deleteShift}>
            <RiDeleteBin6Line></RiDeleteBin6Line>
          </button>
          <p style={{ marginLeft: '6px' }} className={styles.shift_description}>
            {shift.description} : {moment(shift.endTime).format('HH:mm')} - {moment(shift.startTime).format('HH:mm')}
          </p>
        </div>

      </div>
  );
  
}

export default CreateWeekShift