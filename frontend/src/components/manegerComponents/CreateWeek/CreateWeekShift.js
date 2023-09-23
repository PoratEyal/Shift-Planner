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
                confirmButtonColor: '#34a0ff',
                confirmButtonText: 'סגירה'
              })
              props.deleteShift(shift._id);
            }
          })

    }
    
    return (
      <div className={styles.shift_createWeek}>
          <div>
              <RiDeleteBin6Line className={styles.btn_delete} onClick={deleteShift}></RiDeleteBin6Line>
          </div>

          <div className={styles.shift_description_createWeek}>
            {shift.description} : {moment(shift.endTime).format('HH:mm')} - {moment(shift.startTime).format('HH:mm')}
          </div>
      </div>
  );
  
}

export default CreateWeekShift