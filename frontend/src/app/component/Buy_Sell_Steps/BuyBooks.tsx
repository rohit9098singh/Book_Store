import { Search, ShoppingCart, Package } from "lucide-react"

const BuyBooks = () => {
  const book = [
    {
      step: "Step 1",
      title: "Browse Available Books",
      description: "Browse through a wide selection of used books available on BookKart.",
      icon: <Search className="h-12 w-12 text-amber-600" />,
    },
    {
      step: "Step 2",
      title: "Purchase Online",
      description: "Select the books you want and make a secure online payment.",
      icon: <ShoppingCart className="h-12 w-12 text-amber-600" />,
    },
    {
      step: "Step 3",
      title: "Receive Your Books",
      description: "Get your books delivered directly to your doorstep.",
      icon: <Package className="h-12 w-12 text-amber-600" />,
    },
  ]

  return (
    <div className="py-20 bg-indigo-100">
      <div className="container mx-auto px-4">
        <h1 className="text-center font-bold mb-4 text-3xl text-black">How To Buy Books Online On BookKart?</h1>
        <p className="text-gray-600 text-md font-semibold max-w-xl text-center mx-auto mb-12">
          Finding your next favorite book is just 3 simple steps away!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {book.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105 flex flex-col items-center text-center"
            >
              <div className="mb-4 p-3 bg-amber-200/40 rounded-full">{item.icon}</div>
              <div className="font-bold bg-emerald-600/20 px-4 py-1 shadow-md rounded-xl text-emerald-500 mb-2">{item.step}</div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default BuyBooks

