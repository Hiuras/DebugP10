import React, { useEffect, useState } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const [isAutoChange, setIsAutoChange] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isAutoChange) {
        setIndex(prevIndex =>
          prevIndex < byDateDesc.length - 1 ? prevIndex + 1 : 0
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoChange]);

  const byDateDesc = data?.focus ? [...data.focus].sort((evtA, evtB) =>
    new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
  ) : [];

  const handleRadioChange = radioIdx => {
    setIndex(radioIdx);
    setIsAutoChange(false);
  };

  useEffect(() => {
    setIsAutoChange(true);
  }, [index]);

  return (
    <div className="SlideCardList">
      {byDateDesc.map((event, idx) => (
        <div key={event.id}>
          <div
            className={`SlideCard SlideCard--${
              index === idx ? "display" : "hide"
            }`}
          >
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc.map((event, radioIdx) => (
            <input
              key={event.id}
              type="radio"
              name="radio-button"
              checked={index === radioIdx}
              onChange={() => handleRadioChange(radioIdx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;