import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle2,
  MapPin,
  MessageCircle,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { userData } from "@/lib/types/type";

interface BookProps {
  book: {
    _id: string;
    createdAt: Date;
    title: string;
    classType: string;
    category: string;
    author: string;
    edition: string;
    condition: string;
    subject: string;
    description: string;
    seller: userData
  };
}

const BookSellerDetails: React.FC<BookProps> = ({ book }) => {
  return (
    <Card className="border border-gray-200 shadow-md rounded-xl p-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold">
          Sold By
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-6">
        {/* Seller Icon */}
        <div className="p-3 bg-blue-500/30 rounded-full shadow-lg">
          <User className="h-8 w-8 text-blue-500" />
        </div>

        {/* Seller Details */}
        <div className="flex flex-col gap-2">
          <p className="text-lg font-medium">{book?.seller?.name}</p>

          {/* Verified Badge */}
          <Badge className="bg-green-100 text-green-600 flex items-center gap-1 px-3 py-1 rounded-md">
            <CheckCircle2 className="h-4 w-4" />
            Verified Seller
          </Badge>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600 text-sm mt-1 ">
            <MapPin className="h-5 w-5 text-gray-500" />
            <p>
              {book?.seller?.address?.[0]?.city && book?.seller?.address?.[0]?.state ? (
                `${book.seller.address[0].city}, ${book.seller.address[0].state}`
              ) : (
                <span >
                  Location Not Found
                </span>
              )}
            </p>

          </div>
        </div>

        {/* Contact Details */}
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <MessageCircle className="h-5 w-5 text-blue-500" />
          <p className="font-medium">
            Contact: {book?.seller?.contact ? book.seller.contact : "No Contact"}
          </p>

        </div>
      </CardContent>
    </Card >
  );
};

export default BookSellerDetails;
