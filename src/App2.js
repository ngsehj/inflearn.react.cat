import { useEffect, useState } from 'react';
import './App.css';

const jsonLocalStorage = {
  setItem : (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem : (key) => {
    return JSON.parse(localStorage.getItem(key));
  }
}

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

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
      setErrorMessage("한글은 입력할 수 없습니다.");
      return;
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
    updateMainCat(value);
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

const MainCard = ({ img, onHeartClick, alreadyFavorite }) => {
  return (
    <div className="main-card">
      <img src={img} alt="고양이" />
      <button onClick={onHeartClick}>
        {alreadyFavorite ? "❤️" : " 🤍"}
      </button>
    </div>
  )
}

const Favorites = ({ favorites }) => {
  if(favorites.length === 0) {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요.</div>;
  }
  
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
  const [count, setCount] = useState(jsonLocalStorage.getItem("count"));
  const [mainCat, setMainCat] = useState();
  const [favorites, setFavorites] = useState(jsonLocalStorage.getItem("favorites") || []); // falsy
  
  useEffect(()=>{
    async function setInitialCat () {
      const helloCat = await fetchCat("hello");
      setMainCat(helloCat);
    }
    setInitialCat();
  }, []);

  async function updateMainCat (value) {
    const newCat = await fetchCat(value);
    setMainCat(newCat);
    
    const nextCount = count + 1;
    setCount(nextCount);
    jsonLocalStorage.setItem("count", nextCount);
  }
  
  const handleHeartClick = () => {
    const nextFavorites = [...favorites, mainCat];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem("favorites", nextFavorites);
  }

  const alreadyFavorite = favorites.includes(mainCat);

  return (
    <div className="App">
      <Title>{count}번째 고양이 가라사대</Title>
      <Form updateMainCat={updateMainCat} />
      <MainCard img={mainCat} onHeartClick={handleHeartClick} alreadyFavorite={alreadyFavorite} />
      <Favorites favorites={favorites} />
    </div>
  );
}

export default App;
