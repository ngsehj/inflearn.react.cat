import { useState } from 'react';
import './App.css';

const jsonLocalStorage = {
  setItem : (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem : (key) => {
    return JSON.parse(localStorage.getItem(key));
  }
}

const Title = (props) => {
  return (
    <h1>{props.children}</h1>
  );
}

const Form = ({ updateMainCat }) => {
  const includeHangle = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);

  const [value, setValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  const handleInputChange = (e) => {
    setErrorMessage("");

    const useValue = e.target.value;

    if( includeHangle(useValue) ) {
      setErrorMessage("한글은 입력할 수 없습니다.")
    } 
    setValue(useValue.toUpperCase());
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");

    if(value === "") {
      setErrorMessage("빈 값으로 만들 수 없습니다.");
      return;
    }
    updateMainCat();
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input 
        type="text"
        placeholder="영어 대사를 입력해주세요"
        name="name"
        value={value}
        onChange={handleInputChange}
      />
      <button type="submit">생성</button>
      <p style={{ color: "red" }}>{errorMessage}</p>
    </form>
  );
}

const MainCard = ({ img, onHeartClick }) => {
  return (
    <div className="main-card">
      <img src={img} alt="고양이" />
      <button onClick={onHeartClick}>🤍</button>
    </div>
  )
}

const Favorites = ({ favorites }) => {
  return (
    <ul className="favorites">
      {favorites.map((item, idx) => (
        <CatItem img={item} key={idx} />
      ))}
    </ul>
  )
}

const CatItem = ({ img }) => {
  return (
    <li><img src={img} style={{ width: "150px", border: "1px solid #000"}} alt="cat" /></li>
  )
}

function App() {
  const CAT1 = "https://download.hiclass.net/7e60/8460/9c60/c860/044af483-e1b5-4972-9d66-f734312bdeef.jpg";
  const CAT2 = "https://download.hiclass.net/7e60/8460/a260/e160/6dea0d28-da81-48e4-a9e7-d39584ef6e03.jpg";
  const CAT3 = "https://download.hiclass.net/7e60/8460/a260/af60/77477a4c-f807-4dd7-b9d0-2c7dde2414c3.jpg";

  const [count, setCount] = useState(jsonLocalStorage.getItem("count"));
  const [mainCat, setMainCat] = useState(CAT1);
  const [favorites, setFavorites] = useState(jsonLocalStorage.getItem("favorites") || []); // falsy

  const updateMainCat = () => {
    setMainCat(CAT3);
    const nextCount = count + 1;
    setCount(nextCount);
    
    jsonLocalStorage.setItem("count", nextCount);
  }
  
  const handleHeartClick = () => {
    const nextFavorites = [...favorites, mainCat];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem("favorites", nextFavorites);
  }

  return (
    <div className="App">
      <Title>{count}번째 고양이 가라사대</Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard img={mainCat} onHeartClick={handleHeartClick} />
      <Favorites favorites={favorites} />
    </div>
  );
}

export default App;
