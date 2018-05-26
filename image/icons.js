const getIcons = () => {
  const  baseIcons={
    //切换 绿色  35*35
    icon_qiehuan_green_35_35: "https://qnimg.xiaoguikuaipao.com/JmEQYQNtN3ajdc1372be3ac574d50a43e3d", 
    //店铺Icon  绿色  40*36
    icon_dianpu_green_40_36: "https://qnimg.xiaoguikuaipao.com/mLcKmVUHCEBg931502ccc576883776fb2c7",
    //列表Icon  绿色  51*60
    icon_liebiao_green_51_60: "https://qnimg.xiaoguikuaipao.com/sinncp1U5Qjk3544076b328b389384ebcf9",
    //统计Icon  绿色  60*56
    icon_tongji_green_60_56: "https://qnimg.xiaoguikuaipao.com/YAv2ce6uo0Ghc285f9146a0f434cd3ded93",

    //成功Icon  绿色  120*120
    icon_chenggong_green_120_120: "https://qnimg.xiaoguikuaipao.com/yFt5sMskkFAB0e9b27a20f5ac75ede198b8",
    //二维码  
    icon_erweima_gray_30_30:"https://qnimg.xiaoguikuaipao.com/r3q0LLnQikkSaf5caf3f682d57c79cbdfb3",
    //广播icon 绿色 105*83
    icon_Extension_green_105_83: "https://qnimg.xiaoguikuaipao.com/RrpCA3i9vAQW8abf5d579d095b97fa424f7",
    //用户头像icon 绿色
    icon_clerk_green_90_83: "https://qnimg.xiaoguikuaipao.com/0ayFD9dUzt6qf9d0836a64b3b3b849854ce",
    //红包icon 绿色
    icon_redenvelopes_green_51_60: "https://qnimg.xiaoguikuaipao.com/JYRagNicM0Zr85ae8b66182d3fee9eb7c37",  
    //获取地址图标 透明
    icon_address_white_35_41: "https://qnimg.xiaoguikuaipao.com/kvvlDw6fLd5S3ddc4df5b8f5d98bd02721e",
    // 拍照图标
    icon_photo_blue_100_100: "https://qnimg.xiaoguikuaipao.com/hlIHwm66JRuNd645b22bf95e44667e9a565",
    // 获取本地相册
    icon_album_yellow_100_100: "https://qnimg.xiaoguikuaipao.com/AOgPlWo3ixEAb197a1bff9e81eba5458408",
    icon_failImg_white_200_200: "https://qnimg.xiaoguikuaipao.com/mXfQ4Bob12Eife88f4be379377e52d9e244",//保存失败图标
  }
  const  baseImages={
    //店铺信息为空 图片
    img_KongDianPu_gray_310_252: "https://qnimg.xiaoguikuaipao.com/bcAW6TwzgWwl7140b4c6a0953a227d04376", 
    // 推荐龟米红包中间背景图
    img_redpacket_yellow_664_856: "https://qnimg.xiaoguikuaipao.com/8XNsHx4AvrIQb4d2c546fc495bb5c382896"
   
  }
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
    icon_logo_xiaogui: "https://qnimg.xiaoguikuaipao.com/KFjvqN2ZihP00ceedea6e22d04a8c1cb93b",
    icon_date: "https://qnimg.xiaoguikuaipao.com/2G9wzalH3M2K354e26d1c10c262e4b5f931",
    icon_nodata: "https://qnimg.xiaoguikuaipao.com/fOmu29wGKBu16f853550ee4daf127f39157"
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
    bg3: "https://qnimg.xiaoguikuaipao.com/jJ06NeLTjSiE76511b9916b8d91c549448a",
    xin: "https://qnimg.xiaoguikuaipao.com/qV1RA5CaJ1cXcdc6d0ecba4502538c4f23b",
    no: "https://qnimg.xiaoguikuaipao.com/mQTCCFV1ToFQ81194156246033162c8ac60"
  }
  return {
    baseIcons: baseIcons,
    baseImages: baseImages,
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