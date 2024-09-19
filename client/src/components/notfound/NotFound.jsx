import React, { useState } from "react";
import './NotFound.scss'

export default function NotFound({ text }) {
  return (
    <div className="montserrat-alternates-bold header1 notfound_container">{text} не знайдено!</div>
    
  );
}
