<template>
  <q-expansion-item switch-toggle-side expand-separator :content-inset-level="1.5" v-if="totalNumber != 0">
    <template v-slot:header>
      <q-item-section>
        <q-item-label class="text-weight-medium">{{stockItemChild[0].ingredient.name}}</q-item-label>
        <div class="q-gutter-md col" v-if="stockItemChild[0].ingredient.description">
          <q-badge
            v-for="(cat, k) in stockItemChild[0].ingredient.categories"
            :key="k"
            outline
            color="secondary">
              {{cat}}
            </q-badge>
        </div>
        <div class="q-gutter-md q-pt-sm col" v-else>
          <q-badge
            v-for="(cat, k) in stockItemChild[0].ingredient.categories"
            :key="k"
            outline
            color="primary">
              {{cat}}
            </q-badge>
        </div>
      </q-item-section>

      <q-item-section side v-on:click.stop>
        <q-input class="input_readonly_style" dense :readonly="true" type="number" rounded standout v-model="totalNumber">
        </q-input>
      </q-item-section>
      <!-- <q-btn flat round icon="delete" v-on:click.stop @click="remove" /> -->
    </template>

    <q-list v-for="(ensemble,k) in stockItemChild"
        :key="k">
      <q-item
        v-if="ensemble.quantity > 0">
        <q-item-section>
          <q-item-label caption lines="2" style="min-width: 150px">{{new Date(ensemble.ingredient.expiryDate).toDateString()}}</q-item-label>
        </q-item-section>

        <q-item-section side class="input_style">
          <q-input class="input_style" dense rounded standout readonly type="number" v-model="ensemble.quantity" @keyup="$emit('update:stockItem', stockItem);">
            <template v-slot:prepend>
              <q-icon name="remove" @click="ensemble.quantity -= 1; calculTotal()" v-if="ensemble.quantity > 0"/>
                <q-icon name="remove" disable v-if="ensemble.quantity <= 0"/>
            </template>
            <template v-slot:append>
              <q-icon name="add" @click="ensemble.quantity += 1; calculTotal()"/>
            </template>
          </q-input>
        </q-item-section>

      </q-item>
    </q-list>
  </q-expansion-item>

</template>

<script>
import { listManagerMixin } from '../mixins/listManagerMixin'
export default {
  name: 'StockItem',
  mixins: [listManagerMixin],
  props: ['stockItem'],
  data () {
    return {
      totalNumber: 0,
      isRemove: false,
      stockItemChild: this.stockItem
    }
  },
  created () {
    this.calculTotal()
  },
  watch: {
    stockItemChild () {
      this.calculTotal()
    }
  },
  methods: {
    calculTotal () {
      this.saveStockList()
      this.totalNumber = 0
      for (let i = 0; i < this.stockItem.length; i++) {
        this.totalNumber += parseInt(this.stockItem[i].quantity)
      }
    },
    remove () {
      this.isRemove = true
      console.log(this.stockItem)
      for (const elem in this.stockItem) {
        console.log(this.stockItem[elem].ingredient)
        var ing = { 'ingredient': this.stockItem[elem].ingredient, 'quantity': this.stockItem[elem].quantity }
        this.$store.commit('removeIngredientFromStockList', ing)
      }
    }
  }
}
</script>

<style>
.input_style{
  text-align-last: center;
  max-width: 130px;
}
.input_readonly_style{
  text-align-last: center;
  max-width: 100px;
}
</style>
