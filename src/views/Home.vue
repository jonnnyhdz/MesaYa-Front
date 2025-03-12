<template>
  <div class="min-h-screen">
    <Navbar />

    <div id="home">
      <HeroSection />
    </div>

    <div id="filters">
      <FilterBar />
    </div>

    <div id="restaurants">
      <RestaurantCarousel />
    </div>

    <div>
      <TopRestaurantsCarousel />
    </div>

    <div id="categories">
      <PopularCategories />
    </div>

    <div id="reviews">
      <ReviewsCarousel />
    </div>

    <div>
      <RestaurantsMap />
    </div>

    <div id="discounts">
      <DiscountCarousel />
    </div>

    <div id="contact">
      <Footer />
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import HeroSection from '../components/home/HeroSection.vue'
import FilterBar from '../components/home/FilterBar.vue'
import RestaurantCarousel from '@/components/home/RestaurantCarousel.vue'
import TopRestaurantsCarousel from '@/components/home/TopRestaurantsCarousel.vue'
import Footer from '@/components/Footer.vue'
import PopularCategories from '@/components/Home/PopularCategories.vue'
import ReviewsCarousel from '@/components/Home/ReviewsCarousel.vue'
import RestaurantsMap from '@/components/Home/RestaurantsMap.vue'
import DiscountCarousel from '@/components/Home/DiscountCarousel.vue'
</script>
