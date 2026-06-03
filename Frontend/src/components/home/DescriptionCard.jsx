export default function DescriptionCard({ title, description }) {
  return (
    <div className="
      group
      p-6
      rounded-2xl
      bg-white/10
      backdrop-blur-md
      border border-white/20
      shadow-lg
      transition-all duration-300
      hover:scale-105
      hover:shadow-2xl
      hover:border-yellow-400
      cursor-pointer
    ">
      
      <h2 className="text-2xl font-semibold mb-2 group-hover:text-yellow-300 transition">
        {title}
      </h2>

      <p className="text-gray-200 group-hover:text-white transition">
        {description}
      </p>

    </div>
  );
}