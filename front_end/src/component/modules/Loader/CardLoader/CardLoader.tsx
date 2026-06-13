import style from './CardLoader.module.css';
const CardLoader = () => {
  return (
    <div className={style.loading_card}>
      <div className={style.loading_card_image}></div>
      <div className={style.loading_card_content}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
export default CardLoader;
