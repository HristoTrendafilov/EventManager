import HristoTrendafilov from '~asset/Hristo-Trendafilov.png';
import VladimirIvanov from '~asset/Vladimir-Ivanov.png';

export function AboutUs() {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-12 text-center">
          <h1 className="display-4">За нас</h1>
          <p className="lead">Научете повече за нашата компания и екип</p>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-lg-6">
          <h2 className="h3">Нашата мисия</h2>
          <p>
            Нашата мисия е да предоставяме най-добрите услуги на нашите клиенти.
            Стремим се към постигане на съвършенство във всеки аспект на нашия
            бизнес и осигуряване на удовлетвореност на клиентите.
          </p>
        </div>
        <div className="col-lg-6">
          <h2 className="h3">Нашата визия</h2>
          <p>
            Нашата визия е да бъдем водеща компания в нашата индустрия, известна
            с нашите иновации, качество и обслужване на клиенти. Целим да
            направим положително въздействие върху света чрез нашите продукти и
            услуги.
          </p>
        </div>
      </div>
      <div className="row mt-5">
        <div className="col-lg-6 text-center">
          <img
            src={HristoTrendafilov}
            className="mb-1 object-fit-cover"
            alt="Член на екипа 2"
            width="180"
            height="180"
          />
          <div className="fs-4">Христо Трендафилов</div>
          <p className="text-muted">Технически директор</p>
          <p>
            Христо е нашият технически директор, отговарящ за всички технически
            аспекти на компанията. Тя има страст към иновациите и технологиите.
          </p>
        </div>
        <div className="col-lg-6 text-center">
          <img
            src={VladimirIvanov}
            className="mb-1 object-fit-cover"
            alt="Член на екипа 3"
            width="180"
            height="180"
          />
          <div className="fs-4">Владимир Иванов</div>
          <p className="text-muted">Оперативен директор</p>
          <p>
            Владимир е нашият оперативен директор, който гарантира, че нашите
            операции протичат гладко и ефективно. Той има силен опит в
            управлението и операциите.
          </p>
        </div>
      </div>
    </div>
  );
}
