export default function Footer() {
  return (
    <footer className="h-[76px] bg-gray-800 text-white flex items-center justify-center">
      <div className="container mx-auto text-center">
        <p>
          &copy; {new Date().getFullYear()} PDF AI Assistant. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}
