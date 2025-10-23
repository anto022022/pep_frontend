const TempMobScreen = () => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background:
          "linear-gradient(180deg, rgba(245,245,247,0.98) 0%, rgba(240,240,243,0.98) 100%)",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          maxWidth: 560,
          width: "100%",
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
          background: "#fff",
          padding: 24,
          textAlign: "center",
        }}
      >
        {/* <UnderConstructionSVG width={160} height={160} /> */}
        <h2 style={{ margin: "16px 0 8px", fontSize: 22 }}>
          Mobile version under construction
        </h2>
        <p style={{ margin: 0, opacity: 0.8, lineHeight: 1.5 }}>
          Please visit on a larger screen for the best experience.
        </p>
      </div>
    </div>
  );
};

export default TempMobScreen;
