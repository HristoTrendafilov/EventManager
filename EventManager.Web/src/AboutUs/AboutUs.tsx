import HristoTrendafilov from '~/asset/Hristo-Trendafilov.png';
import Together from '~/asset/Together.png';
import VladimirIvanov from '~/asset/Vladimir-Ivanov.png';

export function AboutUs() {
  return (
    <div className="container my-3">
      <div className="row">
        <div className="col-lg-12 text-center">
          <h1 className="display-4">За нас</h1>
          <p className="lead">Научете повече за нашата компания и екип</p>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-lg-6">
          <h2 className="h3">Нашата мисия</h2>
          <img src={Together} className="w-100 _primary-border rounded" alt="together" />
        </div>
        <div className="col-lg-6 mt-lg-5">
          <p>
            В днешния свят, изпълнен с динамика и разделение, нуждата от събиране и подкрепа между хората е по-осезаема
            от всякога. Нашата мисия е да създадем платформа, която не само свързва хора, но и вдъхновява за активно
            участие в общи инициативи и събития, които могат да променят света към по-добро. Всеки може да бъде част от
            нещо по-голямо и да допринесе за създаването на позитивни промени. Нашата цел е да изградим една общност,
            която не само се свързва, но и активно участва в изграждането на по-силно, по-съпричастно и сплотено
            общество. Заедно можем да постигнем повече!
          </p>
          <p>
            Ние вярваме, че силата на обществото се състои в неговата способност да се обединява и да работи заедно.
            Затова на нашия сайт хората имат възможност не само да откриват различни събития, но и да участват активно в
            тях, като помагат, предлагат идеи и допринасят със своите умения и ресурси. Чрез тези събития ние стремим да
            изградим едно по-съпричастно и отговорно общество, което да работи за общото благо.
          </p>
          <p>
            Нашата платформа е пространство за обмен на идеи, за създаване на възможности и за действие. Независимо дали
            искате да организирате събитие, да се включите в инициативи или да помогнете за реализирането на важни
            каузи, тук сте на правилното място.
          </p>
        </div>
      </div>
      <h2 className="h3">Нашият екип</h2>
      <div className="row mt-2 g-2">
        <div className="col-lg-6 text-center">
          <div className="card _primary-border shadow h-100">
            <div className="card-header d-flex h-300px p-2">
              <img src={HristoTrendafilov} className="object-fit-contain w-100" alt="Член на екипа 1" />
            </div>
            <div className="card-body">
              <div className="fs-4">Христо Трендафилов</div>
              <p className="text-muted">Технически директор</p>
              <p>
                Христо е нашият технически директор, отговарящ за всички технически аспекти на компанията. Той има
                страст към иновациите и технологиите.
              </p>
            </div>
          </div>
        </div>
        <div className="col-lg-6 text-center">
          <div className="card _primary-border shadow h-100">
            <div className="card-header d-flex h-300px p-2">
              <img src={VladimirIvanov} className="object-fit-contain w-100" alt="Член на екипа 2" />
            </div>
            <div className="card-body">
              <div className="fs-4">Владимир Иванов</div>
              <p className="text-muted">Оперативен директор</p>
              <p>
                Владимир е нашият оперативен директор, който гарантира, че нашите операции протичат гладко и ефективно.
                Той има силен опит в управлението и операциите.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
