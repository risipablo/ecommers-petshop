import { HelpCircle, User } from "lucide-react"
import '../../assets/styles/user.css'

import { Tooltip } from "@mui/material"

export const UserIcon = () => {
    return(
        <div className="user-container">
            <Tooltip title="Mi cuenta" placement="bottom" arrow>
                <div className="user-icon-wrapper">
                    <User size={28} />
                </div>
            </Tooltip>
            <Tooltip title="Ayuda" placement="bottom" arrow>
                <div className="user-icon-wrapper">
                    <HelpCircle size={28} />
                </div>
            </Tooltip>
        </div>
    )
}