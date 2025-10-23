function Loading({ isWrapper }: { isWrapper?: boolean }) {
  if (isWrapper) {
    return (
      <div className="loader-wrapper">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  return <div className="loading-spinner"></div>;
}

export default Loading;
