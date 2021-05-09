const lazyLoadImage = (imageName, img) => {
  import(
    /* webpackMode: "lazy-once" */
    `../img/${imageName}`
  )
    .then((src) => (img.src = src.default))
    .catch((err) => console.error(err));
};

export default lazyLoadImage;
