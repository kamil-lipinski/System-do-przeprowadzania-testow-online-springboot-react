import React from 'react'
import './popup.css'
import { MdOutlineClose } from 'react-icons/md';

function Popup(props) {
  return (props.trigger) ? (
    <div className="popup">
        <div className="popup-inner">
            <button className="custom-button7" onClick={() => props.setTrigger(false)}><MdOutlineClose size={25}/></button>
            {props.children}
        </div>
    </div>
  ):"";
}

export default Popup
