import { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/opacity.css";
import "./App.css";

// util.js
const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  }
}

const fetchUrl = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
}

// component.js
const Title = (props) => {
  return (
    <h1 className="title">{props.children}</h1>
  );
}

const Form = ({ updateContent }) => {
  const includeKR = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [value, setValue] = useState("");
  const [errMsg, setErrMsg] = useState("");

  const handleChange = (e) => {
    const text = e.target.value;
    setErrMsg("");

    if(includeKR(text)) {
      setErrMsg("한글 입력 ㄴㄴ");
      return; // 한글 입력 방지??
    }
    setValue(text.toUpperCase());
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrMsg("");

    if(value.length === 0) { 
      setErrMsg("빈값 ㄴㄴ");
      return;
    }
    updateContent(value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text"
        placeholder="영어 대사를 입력해주세요"
        value={value}
        onChange={handleChange}
      />
      <button type="submit">생성</button>
      <p style={{color: "red", padding: "10px"}}>{errMsg}</p>
    </form>
  );
}

const Main = ({ img, onHeartClick, alreadyFavorite }) => {
  return (
    <div className="main">
      <img src={img} alt="cat" />
      <button type="button" onClick={onHeartClick}>
        {alreadyFavorite ? "❤️" : "🤍"}
      </button>
    </div>
  )
}

const Favorites = ({ favoritesUrl }) => {
  if( favoritesUrl.length === 0) {
    return (<p style={{ padding: "10px"}}>사진 위 하트를 눌러 고양이 사진을 저장해봐요.</p>)
  }
  return (
    <ul className="favorites">
      {favoritesUrl.map((item, idx) => (
        <CatItem img={item} key={idx} />
      ))}
    </ul>
  )
}

const CatItem = ({ img }) => {
  return (
    <li>
      <LazyLoadImage 
        effect="opacity"
        src={img} 
        alt="favorite cat"
      />
    </li>
  )
}

// App.js
function App () {
  const [count, setCount] = useState(() => jsonLocalStorage.getItem("count"));
  const [mainUrl, setMainUrl] = useState();
  const [favoritesUrl, setFavoritesUrl] = useState(() => jsonLocalStorage.getItem("favoritesUrl") || []);
  const titleCountText = !count ? "" : count + "번째 "; // count가 false면 (null, undefined, 0, NaN, "") 빈 텍스트
  const alreadyFavorite = favoritesUrl.includes(mainUrl);

  // init
  useEffect(()=> {
    async function setInit () {
      const initUrl = await fetchUrl("hello");
      setMainUrl(initUrl);
    }
    setInit();
  }, []);

  async function updateContent (value) {
    const newUrl = await fetchUrl(value);
    setMainUrl(newUrl);

    setCount((prev) => {
      const nextCount = prev + 1;
      jsonLocalStorage.setItem("count", nextCount);
      return nextCount;
    });
  }

  const handleHeartClick = () => {
    const addFavoritesUrl = [...favoritesUrl, mainUrl]
    setFavoritesUrl(addFavoritesUrl);
    jsonLocalStorage.setItem("favoritesUrl", addFavoritesUrl);
  }

  return (
    <div className="App">
      <Title>{titleCountText}고양이 가라사대</Title>
      <Form updateContent={updateContent} />
      <Main img={mainUrl} onHeartClick={handleHeartClick} alreadyFavorite={alreadyFavorite} />
      <Favorites favoritesUrl={favoritesUrl}></Favorites>
    </div>
  )
}

export default App;
