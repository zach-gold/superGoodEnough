import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getRoutesThunk } from "../../redux/route";
import { getAllAscentsThunk } from "../../redux/ascent";
import Slider from "react-slick";
import "./Homepage.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Homepage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const routes = useSelector((state) => state.routes);
  const ascents = useSelector((state) => state.ascents);

  useEffect(() => {
    dispatch(getRoutesThunk());
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllAscentsThunk());
    setLoading(false);
  }, [dispatch]);

  if (loading) {
    return <p>Loading...</p>;
  }

  function NextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{
          ...style,
          display: "block",
          background: "#4CAF50",
          borderRadius: "50%",
        }}
        onClick={onClick}
      />
    );
  }

  function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "#4CAF50", borderRadius: "50%" }}
        onClick={onClick}
      />
    );
  }


    const settings = {
      dots: true,
      infinite: true,
      speed:500,
      slidesToShow: 1,
      slidesToScroll: 1,
      nextArrow: <NextArrow />,
      prevArrow: <PrevArrow />
    };


  return (
    <>
      <div className="home-page">
        <div className="banner">
          <Slider {...settings}>
            {Object.values(routes)
              .slice(0, 5)
              .map((route) => (
                <div key={route.id} className="featured-route">
                  <div
                    className="featured-picture"
                    style={{
                      backgroundImage: `url(${route.images[0]?.picture_url})`,
                    }}
                  >
                    <Link to={`/routes/${route.id}`}>
                      <div className="featured-info">
                        <h3>{route.name}</h3>
                        <p>{route.location}</p>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
          </Slider>
        </div>
        <div className="content">
          <div className="routes-section">
            <h2>Routes</h2>
            <div className="home-routes-list">
              {Object.values(routes).map((route) => (
                <div key={route.id} className="home-route-item">
                  <div className="home-route-details">
                    <Link to={`/routes/${route.id}`}>
                      <h3>{route.name}</h3>
                    </Link>
                    <p>{route.grade}</p>
                    <p>{route.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="ascents-section">
            <h2>Ascents</h2>
            <div className="home-ascents-list">
              {Object.values(ascents).map((ascent) => (
                <div key={ascent.id} className="home-ascent-item">
                  <div className="home-all-ascent-details">
                    <Link to={`/routes/${ascent.parent_route.id}`}>
                      <h3>{ascent.parent_route.name}</h3>
                    </Link>
                    <p>{new Date(ascent.date).toLocaleDateString()}</p>
                    <p>{ascent.style}</p>
                    <p className="home-ascent-notes">{ascent.notes}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
