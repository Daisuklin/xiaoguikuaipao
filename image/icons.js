const getIcons = () => {
  const walletIcons = {//钱包页面的图标
    wallet:"https://qnimg.xiaoguikuaipao.com/26RfAbl9c0FQ1c0745d56a455a40b55943f",
    wechat:"https://qnimg.xiaoguikuaipao.com/zVxe2q0FzYD4b4ff225217e38f8b88618f7",
    gold:"https://qnimg.xiaoguikuaipao.com/X1nfe9mBtkwZ9760cd2501a9ae60fb4ae15",
    icon_recode: "https://qnimg.xiaoguikuaipao.com/vskcS885eLAOc96cfdab21e6b934308a84c",
    icon_user: "https://qnimg.xiaoguikuaipao.com/wL6TMoCLFUb35a25d0c0aab1f0c864b5163",
    icon_jilu: "https://qnimg.xiaoguikuaipao.com/29cBHcZYrhtd6c6742ee8a2c0f7301ef111",
    icon_tongji: "https://qnimg.xiaoguikuaipao.com/RMkr4fdlfzqW8638d2e087e7bac54e0b20f",
    icon_logo_weixin: "https://qnimg.xiaoguikuaipao.com/fsxBY6hInhp9b7ce33bf93e75bc440a1c2f",
    icon_logo_zhifubao: "https://qnimg.xiaoguikuaipao.com/WNkh9JyaoDZge1aff736e6ae7e40c2ddbc7",
    icon_logo_xiaogui: "https://qnimg.xiaoguikuaipao.com/IxfQaXllvwDj22fd4255be194d1897f13f6",
    icon_date: "https://qnimg.xiaoguikuaipao.com/2G9wzalH3M2K354e26d1c10c262e4b5f931"
  }
  const getDetailsIcons = {//提现详情
    details: "https://qnimg.xiaoguikuaipao.com/X2GXlUDXNoYda7949dbfdcb950f3b214060"
  }
  const integralIcons = {
    why: "https://qnimg.xiaoguikuaipao.com/lstcqGx4nveycc8be1a8a19e97e9667c9b9",
    logo: "https://qnimg.xiaoguikuaipao.com/FNcOeB6isXlT24dd27bafde80b736e13ca1",
    items: "https://qnimg.xiaoguikuaipao.com/PpIuJnIQanSXee1dd6088b078e109d7ddd7",
    voucher:"https://qnimg.xiaoguikuaipao.com/EBbbKUPuzLnPa6b33eb74302de7d3cebcb9",
    integral: "https://qnimg.xiaoguikuaipao.com/csNcFaPzRFqFba4ca8902d08d860e0328f3",
    loc: "https://qnimg.xiaoguikuaipao.com/36mYykhqdMP6cf3b89ad662a5e456e3c9ff",
    ok: "https://qnimg.xiaoguikuaipao.com/lRpn4cu9rtXN55bd05bcadbe7a410049ffd"
  }
  const orderDetail = {
    icon_showIntegral:"https://qnimg.xiaoguikuaipao.com/w3EL81XcMdPP0bb011040957d54b75e2eb0",
    icon_showIntegral_close: "https://qnimg.xiaoguikuaipao.com/fzI4RJYwRRnW8095a9ad0e0a4b04ef0eeb1",
    icon_payment_completion: "https://qnimg.xiaoguikuaipao.com/NyqUuKr5z643d7f85c7db12166f57b0cf33",
  }
  const myPage = {
    bg1: "https://qnimg.xiaoguikuaipao.com/qZzPOOy8JUK80bb9fe4fcf5a29bb2f03949",
    bg2: "https://qnimg.xiaoguikuaipao.com/WCBqi1Va9Wardaa903c71a9eb651c6b28df",
    contact: "https://qnimg.xiaoguikuaipao.com/5GjRjnnoGF86b7a8f2fbe872cb777931498",
    fav: "https://qnimg.xiaoguikuaipao.com/hllkHktAGbMxf0afd73f93303b99d5d0781",
    foot: "https://qnimg.xiaoguikuaipao.com/zC0Rw48BeaL6e7f06870bafc34ba5940f8f",
    wallet: "https://qnimg.xiaoguikuaipao.com/wpzY0MUlXYu43873f6fce3c60e0ca531cec",
    security: "https://qnimg.xiaoguikuaipao.com/7j9fQHhACTjE7e7970e3bcfc9f0ce8950b6",
    dk: "https://qnimg.xiaoguikuaipao.com/9c7SlT2R1LZ8cdbdfa4cf1cbca5c7f1553c"
  }
  const voucherIcons = {
    bg1: "https://qnimg.xiaoguikuaipao.com/vKRtJ7fCOWYNa9fb6c371a04350579ca4f7",
    check: "https://qnimg.xiaoguikuaipao.com/Yz8Wn9C1pqw733f32ac950a7d01b7acdec5",
    bg2: "https://qnimg.xiaoguikuaipao.com/4ocRq10aV5oa125b8896ef4c3fbf960c27d",
    xin: "https://qnimg.xiaoguikuaipao.com/qV1RA5CaJ1cXcdc6d0ecba4502538c4f23b",
    no: "https://qnimg.xiaoguikuaipao.com/mQTCCFV1ToFQ81194156246033162c8ac60"
  }
  return {
    walletIcons: walletIcons,
    getDetailsIcons: getDetailsIcons,
    integralIcons: integralIcons,
    orderDetail: orderDetail,
    voucherIcons: voucherIcons,
    myPage: myPage
  }
}

module.exports = {
  getIcons: getIcons
} 