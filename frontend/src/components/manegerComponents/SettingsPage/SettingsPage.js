import React, { useState } from "react";
import PageLayout from "../../layout/PageLayout";
import styles from "../SettingsPage/settingsPage.module.css";
import axios from "axios";
import { ManagerContext } from "../ManagerHomePage";
import { useContext } from "react";

const SettingsPage = () => {
    const [isChecked, setIsChecked] = useState(false);

    const managerContext = useContext(ManagerContext);
    const managerId = managerContext.getUser();

    const handleCheckboxChange = (event) => {
        const { checked } = event.target;
        console.log(checked);
        setIsChecked(checked);

        const requestData = {
            id: managerId,
            roleStatus: checked,
        };
        axios
            .post(`${process.env.REACT_APP_URL}/rolesToShow`, requestData)
            .then((response) => {
                console.log(response.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <PageLayout text="הגדרות">
            <div className={styles.container}>
                <div className={styles.margin_div}>
                    <label className={styles.switch}>
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                        />
                        <span className={styles.slider}></span>
                    </label>

                    <label className={styles.text}>הצגת תפקידים </label>
                </div>
            </div>
        </PageLayout>
    );
};

export default SettingsPage;
