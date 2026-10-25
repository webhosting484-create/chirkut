import React from 'react';

interface ProfileAboutTabProps {
  displayName: string;
  bio: string;
  favoriteScent: string;
  favoriteMood: string;
  location: string;
  joinedDate: string;
  lang: 'bn' | 'en';
}

export const ProfileAboutTab: React.FC<ProfileAboutTabProps> = ({
  displayName,
  bio,
  favoriteScent,
  favoriteMood,
  location,
  joinedDate,
  lang,
}) => {
  return (
    <div className="p-6 rounded-2xl bg-[#1A1411] border border-[#2D231B] shadow-xl space-y-6">
      <div>
        <h3 className="font-serif text-lg text-[#FAF3EB] font-light mb-1">
          {displayName} — {lang === 'bn' ? 'লেখক ও স্মৃতি পরিচয়' : 'Author Profile'}
        </h3>
        <p className="text-xs font-serif text-[#8C7A6B]">
          {lang === 'bn'
            ? 'স্মৃতির ঘ্রাণ, কাগজের ঐতিহ্য ও চিরকুটের গভীরতর বন্ধন।'
            : 'The essence of memory, scent alchemy and parchment prose.'}
        </p>
      </div>

      {/* Bio Card */}
      <div className="p-4 rounded-xl bg-[#201915] border border-[#2C231B] text-xs font-serif leading-relaxed text-[#C8BCB0]">
        <strong className="text-[#FAF3EB] block mb-1">
          {lang === 'bn' ? 'আত্মকথা ও দর্শন:' : 'Philosophy & Bio:'}
        </strong>
        "{bio}"
      </div>

      {/* Scent Table */}
      <div className="p-4 rounded-xl bg-[#201915] border border-[#2C231B] text-xs font-serif space-y-3">
        <strong className="text-[#FAF3EB] block mb-1">
          {lang === 'bn' ? 'সুবাস রসায়ন প্রোফাইল:' : 'Scent Alchemy Profile:'}
        </strong>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[#C8BCB0]">
          <div>
            <span className="text-[#8C7A6B] block text-[10px]">
              {lang === 'bn' ? 'প্রিয় সুবাসের নোট' : 'Signature Scent'}
            </span>
            <span className="text-[#FAF3EB] font-medium">{favoriteScent}</span>
          </div>
          <div>
            <span className="text-[#8C7A6B] block text-[10px]">
              {lang === 'bn' ? 'অনুভূতির মেজাজ' : 'Dominant Mood'}
            </span>
            <span className="text-[#FAF3EB] font-medium">{favoriteMood}</span>
          </div>
          <div>
            <span className="text-[#8C7A6B] block text-[10px]">
              {lang === 'bn' ? 'শহর / ঠিকানা' : 'Origin & City'}
            </span>
            <span className="text-[#FAF3EB] font-medium">{location}</span>
          </div>
          <div>
            <span className="text-[#8C7A6B] block text-[10px]">
              {lang === 'bn' ? 'যুক্ত হওয়ার সময়কাল' : 'Member Since'}
            </span>
            <span className="text-[#FAF3EB] font-medium">{joinedDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
