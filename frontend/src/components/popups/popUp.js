import styles from './popUp.module.css'

const PopUp = (props) => {
    
    return <div className={styles.contianer}>

        <div>
            <div className={styles.title}>
                הוספת עובד למשמרת
            </div>

            <select className={styles.add_specific_worker_select} defaultValue="">
                {props.newWorkers.map((elem, index) => (
                    <option key={index} value={elem._id}>
                    {elem.role ? `${elem.fullName} - ${elem.role.name}` : elem.fullName}
                    </option>
                ))}
            </select>
        </div>

        <div>
            <div className={styles.title}>
                הוספת עובד שביקש את עצמו למשמרת
            </div>

            <select className={styles.add_specific_worker_select} defaultValue="">
                {props.availableWorkersArr.length === 0 && (
                <option value="" disabled>אף עובד לא בחר את עצמו למשמרת עד כה</option>
                )}
                {props.availableWorkersArr.map((elem, index) => (
                <option key={index} value={elem._id}>
                    {elem.role ? `${elem.fullName} - ${elem.role.name}` : elem.fullName}
                </option>
                ))}
            </select>
        </div>

    </div>
}

export default PopUp
