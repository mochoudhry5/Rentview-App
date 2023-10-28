import {
  collection,
  doc,
  updateDoc,
  getDoc,
  addDoc,
  setDoc,
} from 'firebase/firestore';
import {db} from '../config/firebase';
import {auth} from '../config/firebase';

export const handleReview = async (
  homeId: string,
  userOverallRating: number,
  userHouseQuality: number,
  userRecommend: boolean,
  userLandlordRating: number,
  text: string,
) => {
  const user = auth.currentUser;
  const userId = user ? user.uid : '';
  const homeInfoRef = doc(db, 'HomeReviews', homeId);
  const homeInfoSnapshot = await getDoc(homeInfoRef);

  const userInfoRef = doc(db, 'UserReviews', userId);
  const userInfoSnapshot = await getDoc(userInfoRef);

  if (homeInfoSnapshot.exists()) {
    const date = new Date();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();

    var totalReviews = homeInfoSnapshot.data().totalReviews + 1;

    var rating = {
      oneStar: homeInfoSnapshot.data().overallRating.oneStar,
      twoStar: homeInfoSnapshot.data().overallRating.twoStar,
      threeStar: homeInfoSnapshot.data().overallRating.threeStar,
      fourStar: homeInfoSnapshot.data().overallRating.fourStar,
      fiveStar: homeInfoSnapshot.data().overallRating.fiveStar,
      avgOverallRating: 0,
    };

    var landlordRating = {
      oneStar: homeInfoSnapshot.data().landlordService.oneStar,
      twoStar: homeInfoSnapshot.data().landlordService.twoStar,
      threeStar: homeInfoSnapshot.data().landlordService.threeStar,
      fourStar: homeInfoSnapshot.data().landlordService.fourStar,
      fiveStar: homeInfoSnapshot.data().landlordService.fiveStar,
      avgLandlordService: 0,
    };

    var houseRating = {
      oneStar: homeInfoSnapshot.data().houseQuality.oneStar,
      twoStar: homeInfoSnapshot.data().houseQuality.twoStar,
      threeStar: homeInfoSnapshot.data().houseQuality.threeStar,
      fourStar: homeInfoSnapshot.data().houseQuality.fourStar,
      fiveStar: homeInfoSnapshot.data().houseQuality.fiveStar,
      avgHouseQuality: 0,
    };

    var recommendation = {
      yes: homeInfoSnapshot.data().wouldRecommend.yes,
      no: homeInfoSnapshot.data().wouldRecommend.no,
    };

    if (userRecommend) {
      recommendation.yes += 1;
    } else {
      recommendation.no += 1;
    }

    if (userOverallRating === 1) {
      rating.oneStar += +1;
    } else if (userOverallRating === 2) {
      rating.twoStar += 1;
    } else if (userOverallRating === 3) {
      rating.threeStar += 1;
    } else if (userOverallRating === 4) {
      rating.fourStar += 1;
    } else {
      rating.fiveStar += 1;
    }

    if (userLandlordRating === 1) {
      landlordRating.oneStar += +1;
    } else if (userLandlordRating === 2) {
      landlordRating.twoStar += 1;
    } else if (userLandlordRating === 3) {
      landlordRating.threeStar += 1;
    } else if (userLandlordRating === 4) {
      landlordRating.fourStar += 1;
    } else {
      landlordRating.fiveStar += 1;
    }

    if (userHouseQuality === 1) {
      houseRating.oneStar += +1;
    } else if (userHouseQuality === 2) {
      houseRating.twoStar += 1;
    } else if (userHouseQuality === 3) {
      houseRating.threeStar += 1;
    } else if (userHouseQuality === 4) {
      houseRating.fourStar += 1;
    } else {
      houseRating.fiveStar += 1;
    }

    rating.avgOverallRating =
      (1 * rating.oneStar +
        2 * rating.twoStar +
        3 * rating.threeStar +
        4 * rating.fourStar +
        5 * rating.fiveStar) /
      totalReviews;

    landlordRating.avgLandlordService =
      (1 * landlordRating.oneStar +
        2 * landlordRating.twoStar +
        3 * landlordRating.threeStar +
        4 * landlordRating.fourStar +
        5 * landlordRating.fiveStar) /
      totalReviews;

    houseRating.avgHouseQuality =
      (1 * houseRating.oneStar +
        2 * houseRating.twoStar +
        3 * houseRating.threeStar +
        4 * houseRating.fourStar +
        5 * houseRating.fiveStar) /
      totalReviews;

    await updateDoc(homeInfoRef, {
      landlordService: landlordRating,
      houseQuality: houseRating,
      wouldRecommend: recommendation,
      totalReviews: totalReviews,
      overallRating: rating,
    });

    if (user && userInfoSnapshot.exists()) {
      await setDoc(
        doc(db, 'HomeReviews', homeId, 'IndividualRatings', userId),
        {
          landlordServiceRating: userLandlordRating,
          recommendHouseRating: userRecommend,
          houseQualityRating: userHouseQuality,
          overallRating: userOverallRating,
          additionalComment: text,
          dateOfReview: month + '/' + day + '/' + year,
          reviewerEmail: user.email,
          reviewerUsername: userInfoSnapshot.data().username,
        },
      );

      await addDoc(collection(db, 'UserReviews', userId, 'Reviews'), {
        homeId: homeId,
        address: homeInfoSnapshot.data().address,
        landlordServiceRating: userLandlordRating,
        overallRating: userOverallRating,
        houseRating: userHouseQuality,
        recommendHouseRating: userRecommend,
        additionalComment: text,
        dateOfReview: month + '/' + day + '/' + year,
      });
    }
  }
};
