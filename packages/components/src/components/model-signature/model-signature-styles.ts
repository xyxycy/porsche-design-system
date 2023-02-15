import { getCss, isThemeDark } from '../../utils';
import { addImportantToEachRule, hostHiddenStyles } from '../../styles';
import type { ModelSignatureColor, ModelSignatureModel, ModelSignatureSize } from './model-signature-utils';
import type { Theme } from '../../types';

// TODO: use in checkbox wrapper and stepper-horizontal-item, too
const escapeHashCharacters = (input: string): string => input.replace(/#/g, '%23');

const modelToSvgMap: Record<ModelSignatureModel, string> = {
  '718': escapeHashCharacters(
    '<svg height="28" width="111" viewBox="0 0 111 28" xmlns="http://www.w3.org/2000/svg"><path d="m94.6964 20.9995h-8.2812l-7.51.0005c-1.047 0-1.9053-.7866-1.9053-1.749 0-.9576.86-1.7505 1.9058-1.7505h7.5095l8.2807-.0005c1.0464 0 1.9041.7892 1.9041 1.751 0 1.2516-.8565 1.7485-1.9036 1.7485zm-15.9019-13.99898h7.9781l2.2856-.00052h5.6333c1.0488 0 1.9062.78708 1.9085 1.74948-.0023.96239-.8597 1.75002-1.9085 1.75002h-7.9189l2.2856.0005h-10.1498c-1.0488 0-1.9062-.78708-1.9085-1.75.0023-.9624.7464-1.74948 1.7946-1.74948zm31.8055 11.32438c0-1.8857-1.851-4.0805-3.976-4.4194 0 0 1.018-.4716 1.597-1.3366.378-.5623.699-1.3923.699-2.2321l-.002-6.55441c-.055-2.00234-1.742-3.6824454-3.721-3.7686045l-20.3254-.0137855 1.5627.00057439-17.4129.01378551c-1.9798.0861591-3.6665 1.7668401-3.7217 3.7686001l-.0017 6.55444c.0006.8397.3206 1.6697.698 2.2321.5803.865 1.5983 1.3366 1.5983 1.3366-2.1257.3389-3.9756 2.5336-3.9756 4.4194v-18.2979291l-8.0288.0505467-14.0726 2.3917824.0017-2.4187789h-40.819049v8.2345189h23.926149l-17.66742 19.70916h16.77972l15.964-17.5425 6.7896-.95928v18.50178h17.1267v-3.8099c.0023 2.1511 1.9608 3.8151 3.8883 3.8151h16.7625l2.1654-.0006h20.2761c1.929 0 3.889-1.6663 3.889-3.8197z" fill="#010205"/></svg>'
  ),
  '911': escapeHashCharacters(
    '<svg height="28" width="106" viewBox="0 0 106 28" xmlns="http://www.w3.org/2000/svg"><path d="m105.7 0v28h-17.6568v-20.11257l-9.3328 1.22202v18.89055h-17.6567v-20.11257l-9.4183 1.23328v15.34579c0 1.8848-1.5015 3.4358-3.3651 3.5122l-.1441.003h-48.1262v-7.1971h35.0037c2.4854 0 2.8244-3.3968.1423-3.512l-.1415-.003h-30.75389c-1.88597 0-4.145325-1.5104-4.24704784-3.3836l-.00356216-.1312v-10.21006c0-1.88491 1.50096-3.43557 3.36518-3.5119245l.1441-.0029463h44.61692c1.6696 0 3.0762 1.1832008 3.4257 2.7539208l.0296.14837 18.5646-2.8830331 8.5643-.0491269v2.91067l18.4251-2.8615431zm-70.6269 6.92533h-22.0996c-1.0708 0-1.9557.88638-1.9557 1.95905 0 1.03903.8184 1.89582 1.8413 1.95572l.1144.0033h22.0996c1.0708 0 1.9558-.88648 1.9558-1.95915 0-1.03891-.8182-1.89571-1.8413-1.95558z" fill="#010205"/></svg>'
  ),
  boxster: escapeHashCharacters(
    '<svg height="24" width="220" viewBox="0 0 220 24" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="m53.1974.00162761c21.2174-.13491861 25.606 8.15485239 1.9354 11.16627239 11.1371 1.0612 11.4742 5.9206 5.5997 8.8911-.0793.0405-.1556.0813-.2369.1206.242-.0212.4931-.0385.73-.0628 1.0802-.0944 2.1296-.2317 3.1817-.4175.2912-.0509.5828-.0994.8767-.1592.1499-.03.3048-.0674.4558-.0998.4265-1.0805 1.4851-2.2632 3.0376-3.4339 2.4046-1.8133 5.9926-3.5946 10.0692-4.8867 4.0769-1.29216 7.878-1.87154 10.8177-1.80254 2.1785.05166 3.885.46374 4.7499 1.23704.8391.3939 3.6512.3954 6.4518.2452l.35-.0195c2.913-.1692 5.723-.4919 6.189-.696l1.448 2.4698c1.871-.707 4.022-1.5986 4.979-1.9267 1.415-.4845 2.972-.93708 4.266-1.18918.773-.15034 1.917-.23476 3.109-.28028l.239-.00859c.16-.0054.32-.01013.48-.01427l.239-.00577c2.15-.04802 4.172.00669 4.172.00669-4.069 1.4991-10.791 4.2168-15.313 6.4414.227.3662.403.6556.577.9355l.116.1861c.233.3722.48.7544.851 1.3069.49.7008 1.121 1.3615 3.782 1.488.446.0216 1.849-.1276 1.849-.1276s.457.2872 1.073.3936c1.793.3091 3.792.5419 7.585.4891 6.3-.0882 8.659-.5123 9.692-1.0188 1.452-.7112-.95-1.1402-5.193-2.2462-.339-.0889-1.081-.2761-1.843-.4636l-.254-.0624c-.508-.1243-1.005-.2439-1.378-.3298-3.852-.8881-3.199-2.4828-3.183-2.5195 1.306-2.9447 13.852-5.35352 21.722-3.83627 1.792.37087.67 1.31487-.413 2.40497-2.812-.1831-5.314-.1495-7.503.0556-1.76.0963-3.549.3989-5.411.9644-1.608.5378-2.108.8003.06 1.2417 7.619 1.5535 11.177 3.642 10.26 5.4368-.045.089-.108.1812-.199.2895 1.713-.0555 3.031-.1106 5.459-.4857.443-.7459 1.172-1.6214 2.187-2.6429 2.275-2.6413 5.594-5.9125 9.167-9.20411-2.813.13553-4.323.20006-5.875.31668l-.233.0179c-.585.0458-1.185.0998-1.871.16847.263-.30923.287-.31341.598-.62604l.072-.07194c.126-.12851.295-.30196.529-.54828.933-.98143 1.599-1.64793 3.605-1.88269 1.5-.17578 3.779-.31995 6.668-.54854 1.194-1.05236 2.365-2.07543 3.484-3.07421 1.756-.11102 3.83-.23822 5.806-.2521-.884.79679-1.978 1.78747-3.223 2.92387 3.064-.1114 7.665-.31879 10.972-.12297-.991.94983-1.384 1.33955-2.328 2.16756-1.402 1.32991-2.182 1.18381-3.34 1.23123-1.127.01807-1.974.02119-2.747.02217l-.23.00024c-.038.00004-.076.00007-.114.0001l-.226.00019c-.15.00014-.299.00033-.449.00066l-.226.00061c-1.247.00411-2.605.02154-5.008.10979-3.258 3.01521-6.571 6.45601-8.916 8.71651-4.664 4.4955-3.038 3.9269 2.996 3.6235 2.249-.1137 4.357-.367 6.598-.6426.436-2.0396 4.772-5.5787 12.529-8.3869.98-.3546 2.323-.7918 3.292-1.02114 1.628-.38625 5.41-1.37925 7.432.52614.658.6187.873 1.1318 1.338 2.023.007.0139.194.4676.253.6665.128.4364-.046 1.0609-.66 1.3982-1.336.7336-4.72 1.911-8.31 3.0346l-.407.127c-.136.0422-.272.0843-.408.1263l-.409.1255c-2.795.8548-5.588 1.6437-7.525 2.1364.595.1241 1.334.2019 2.178.2374 4.512.1901 12.062-.8114 17.204-2.3595l5.906-7.3172 6.219-.6762-2.797 3.348c2.476-.9576 9.292-3.56575 13.046-3.66058 1.055-.02659 1.682.14302 2.275.60718.292.2289 1.203 1.7878 1.388 2.1868.79 1.7081-.572 2.1221-1.345 2.3144l-4.392.9884c-.173.0447-.464-.027-.569-.2964-.539-1.3808-1.605-1.5682-2.305-1.4282-1.231.2532-2.659.508-3.89.8723-1.833.5196-5.231 1.6302-7.679 2.6251l-3.814 3.8945-.164.1484c-.853.7629-1.775 1.4514-3.082 1.4514h-3.044l1.575-1.828c-3.632.7937-7.667 1.685-10.994 1.922-2.431.1724-4.29.2172-5.203.22h-.166c-.137-.0004-.245-.0019-.321-.0041-2.465-.0701-5.625-.4302-6.728-1.397-4.681.6565-9.025.936-11.253 1.0805-3.806.2464-5.838.049-6.879-.636-4.335.3546-7.475.3693-10.928.1866-2.229.2856-4.636.5034-6.424.6634-8.263.7409-14.171-.5416-14.171-.5416l-.025.0027c-.303.0318-3.202.3362-4.138.407-1.946.1469-3.32-.6121-4.02-1.5284-.302-.3938-.674-.9127-1.043-1.438l-.116-.166c-.753-1.0783-1.455-2.1309-1.455-2.1309-.447.2313-.897.4662-1.347.7022l-.54.2836c-2.429 1.277-4.8203 2.5573-6.6354 3.453-1.1915.589-2.5513.7081-4.7148.7178l-4.3165.0185c6.5763-3.9408 10.1855-5.9048 15.3877-8.4162 0 0-.338-.5443-.781-1.2559-3.26.5443-6.429.513-8.7685.3226-.3541.8384-1.091 2.0068-2.2101 2.9034-2.2143 1.7744-5.3324 3.6837-9.4136 5.0676-4.0807 1.385-8.3583 1.9602-11.4903 1.9509-2.0383-.0066-3.7333-.4244-4.83-1.1071-.0054.0008-.012.0015-.0174.0023-.3105-.1665-.5458-.3685-.7288-.5805-2.8804.5154-8.8935 1.0739-15.3955 1.4679-5.7696.3612-12.0061.5852-16.8269.5188-.2304-.0015-.4577-.0034-.6815-.0057-2.8765.0643-5.8659.0929-8.8815.0907-8.5272-.0059-17.24689-.2546-24.104027-.6227l2.670817-1.996c1.02318-.7506 2.405-1.2332 3.80455-1.3249 1.32058.0497 2.68662.0798 4.15936.1141l6.6148.1102c1.6931.0193 3.397.027 5.0947.0243l.4633.0002c6.9473-.0008 13.8113-.1819 19.3492-.5533 20.5919-1.382 16.4344-6.8061-6.8278-6.7217-.6696.0019-1.353.0085-2.0541.0201-.6996.0119-4.1358.1846-4.8832.2004-1.8973 1.3137-5.8293 3.9897-7.6688 5.2969l-7.0606.0675c.0043-.0031.0085-.007.0128-.0097 1.1044-.8465 2.5356-1.9235 4.1112-3.0992 1.4931-1.1145 3.1146-2.3172 4.7183-3.5025.0999-.0739.1997-.1476.2994-.2213l.2987-.2206c4.7723-3.52456 9.1914-6.75351 9.1914-6.75351-.0597.00617-.5208.05551-1.1857.12605-1.6319.1727-4.5242.47453-5.965.59056-.0289.00501-.0123-.02853.0339-.08596.0324-.04025.0813-.09392.1444-.15856l.0824-.08268c.341-.33589.9625-.88298 1.6333-1.4016l.1759-.13449c.2946-.22255.5948-.43577.8814-.61998 1.3745-.88429 2.7637-1.18998 5.3655-1.64408 3.307-.578016 7.6144-.862331 11.9043-1.092589l.7146-.037916c.9522-.049998 1.9007-.097984 2.8343-.146589 1.4077-.073241 2.7529-.1106333 4.0392-.11872839zm36.4292 12.98557239c-.2538-.6619-1.4458-.9159-3.1742-.8003-1.7408.1161-4.0206.6086-6.4752 1.4692-2.455.8599-4.6255 1.93-6.1024 2.9541-1.4881 1.0321-2.2903 2.0194-2.0395 2.7095.2499.6901 1.5129.9449 3.3315.8018 1.8117-.1423 4.3148-.6199 6.7701-1.5068 2.4562-.8878 4.4047-2.0158 5.8122-3.022 1.3939-.9967 2.1314-1.944 1.8775-2.6055zm95.4414-.3346c-.448-.387-1.481-.0307-2.179.1701-4.636 1.3289-9.014 3.6964-10.808 5.7372 3.206-.9328 10.093-3.2417 13.627-4.6489.112-.0508.138-.1224.068-.2823-.076-.1721-.306-.6276-.708-.9761zm-133.7221-9.13262-.5398.00125c-.8757.00397-1.7884.01824-2.7379.0436-2.5973.07016-5.1385.10662-6.6852.20729 0 0-2.3863 1.61898-4.6595 3.17055l-.2062.14082c-.9949.67928-1.9532 1.33567-2.6631 1.82613-.0232.01585-.0502.03448-.0726.05034.7768-.05668 4.045-.13952 4.8558-.16489 32.1981-1.02139 30.3262-5.35945 12.1687-5.27384z" fill="#010205" fill-rule="evenodd"/></svg>'
  ),
  cayenne: escapeHashCharacters(
    '<svg height="32" width="221" viewBox="0 0 221 32" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="m62.9963 0c1.5992.0825747 1.8075.30521 2.3349 1.66684.083.21289.2603.57291-.1912.64208-.082.01243-.1626.02314-.2441.03313-.6959.08569-1.4374.1767-2.1682.26663l-.3123.03845c-1.6088.19817-3.1257.38657-3.9398.49582-13.313 1.78717-18.2123 2.84457-30.2815 6.22136-6.7539 1.88949-11.6246 3.66859-14.5399 5.00689-8.2251 3.7757.3336 5.5763 29.4756 4.0685 2.7108-.2109 5.6398-.4645 8.7754-.7797 1.5109-2.0999 5.5706-4.1312 11.8208-5.8981 6.5858-1.86171 14.6561-2.41878 18.9026-2.31623l-4.9193 5.61243c-.1753.2004-.272.4104-.3107.4993-.1395.3203-.0669.6991.0815 1.0852.1674.4355.3656.8596.5118 1.1412.2119.4077.5953.5385 1.2005.3575 1.5522-.5088 4.1589-1.5034 6.1769-2.3941.7309-.8359 1.9048-2.0722 2.9473-3.1323l.1724-.1749c.9405-.9521 1.7438-1.7292 1.9674-1.887 2.1107-.3556 3.6147-.369 6.5297-.67083-1.6554 1.66633-4.5142 4.65683-6.0456 6.62863-.0642.0827-.1334.1717-.2016.2627l-.0509.0686-.0499.069c-.3451.4833-.5804.9665.1572.85 2.8041-.4433 7.5976-2.2522 9.8607-3.4423l4.564-4.44175 6.597-.59946c-.585.50806-1.178 1.02751-1.774 1.55401l-.399.3521c-.199.1765-.399.3537-.598.5315l-.4.3561-.4.3574c-.333.2981-.666.5972-.998.8965l-.398.3592c-4.97 4.4902-9.6786 8.9611-11.7086 10.9898 3.9009-2.0098 7.7046-3.3911 12.4466-4.8953-.561-3.0759 4.804-6.9672 15.473-9.7462 2.209-.57559 7.013-1.61715 8.535-.04263.597.62043.866.92903 1.405 1.81253.136.2175.217.3982.29.6467.128.4321-.069 1.0537-.709 1.3865-1.568.8156-5.258 2.1194-9.024 3.2893l-.389.1205c-2.404.7399-4.81 1.4165-6.686 1.8684 3.792.5573 12.678.0253 18.917-1.6927l6.137-7.1085 6.484-.64547-3.2 3.62477c2.831-.9666 16.254-5.70351 17.336-3.32858l.41.92388c.132.2943.155.7415-.182 1.1332l-3.696 4.2603c-1.868 1.9898-1.078 2.2039.195 1.8887 1.754-.3062 3.657-.7215 5.514-1.2053l5.886-6.6515 6.484-.64547-3.2 3.62477c.368-.1257.915-.315 1.59-.5442l.321-.1085c4.669-1.5749 14.505-4.69457 15.425-2.67588l.41.92388c.131.2943.155.7415-.182 1.1332l-3.216 3.7105c-.043.0504-.92 1.0601-.957 1.1032-1.632 1.8641-1.496 2.2799-.626 2.228 1.299-.0867 3.471-.3105 4.747-.4847.946-2.8214 6.194-6.0204 15.338-8.4022 2.209-.57555 6.997-1.60054 8.535-.0426.63.6367.927.9303 1.424 1.8391.113.2075.183.415.249.6277.134.4301-.047 1.0462-.687 1.3789-1.46.7594-4.76 1.942-8.246 3.0456l-.388.1222c-.065.0204-.13.0406-.195.0609l-.389.121c-2.469.7633-4.954 1.4645-6.88 1.9285 3.647.5361 12.009.0643 18.242-1.5078.479-.1249.837-.124 1.054-.0331.491.2053 1.019 1.1202 1.087 1.289.049.1245.018.2324-.154.3118-1.419.6178-2.66 1.006-4.115 1.3446-3.754.8723-9.494 1.5246-12.957 1.7285-2.039.12-3.691.1506-4.753.1525l-.159.0001c-.488-.0004-.833-.0068-1.012-.0123-1.955-.0607-4.449-.2811-5.443-1.7338-5.328.9433-9.819 1.3068-11.485 1.2992-.366-.0017-.766-.0136-.974-.0346-1.483-.1495-1.967-.7054-1.355-1.726 1.202-2.0064 3.681-4.6839 5.485-6.576.12-.1635.103-.2443-.044-.2424-2 .2495-7.108 1.1804-12.987 3.4399l-3.48 3.3298c-.909.7826-1.942 1.3019-3.253 1.3748l-3.145.0419 1.656-2.0001c-3.486.9103-7.354 1.975-10.547 2.184-2.303.1505-3.163-.3111-2.419-1.5519 1.202-2.0064 3.701-4.6641 5.479-6.576.135-.1454.096-.2443-.051-.2424-2 .2495-7.108 1.1804-12.987 3.4399l-3.48 3.3298c-.909.7826-1.942 1.3446-3.253 1.4176l-3.145-.0009 1.229-1.2197c-3.81.8562-9.561 1.5361-13.023 1.7402-2.04.1202-3.692.1558-4.754.1578h-.234c-.448-.0013-.767-.0089-.936-.0177-1.94-.1014-3.449-.4163-4.701-.9127-3.699 1.0827-13.3152 4.6863-17.2871 6.8853-1.9578 1.0837-3.1481 2.0676-4.7848 2.9742l-2.9745.6898c4.3158-4.7058 8.6268-9.223 12.5652-13.192-2.6673 1.245-7.8116 2.6794-11.2945 3.2497-3.7586.6153-4.3242-.2054-2.9427-2.27.0264-.0394.368-.6014.6953-1.0201-.5058.2383-1.0394.4783-1.5823.7137l-.2722.1173c-2.6367 1.1296-5.4191 2.1279-6.2549 2.2876-.7783.1488-1.4376-.0324-1.7419-.4165-.6248-1.1074-1.1203-2.1292-1.6566-3.3279-.1744.0819-.3531.1642-.5243.2412-1.0472.4713-2.0516.8788-3.0791 1.272-9.3623 3.5141-14.8852 3.0903-16.4414 1.1694-5.0106.6472-9.8531 1.2021-14.7313 1.6381-9.64.8011-16.0558 1.1522-25.2846.7047-23.8694-1.1578-9.50415-16.17003 36.3409-21.79778 6.4361-.789936 11.0129-1.256641 13.8885-1.3479842.392-.0065768.7648-.0197307 1.1316-.0214358zm12.4274 12.1481c-4.1583.4762-8.1101 1.5522-12.0495 2.9977-6.2596 2.4157-7.1323 4.5006-.799 3.0326.9485-.2417 2.1452-.5676 3.5259-1.0165 3.9762-1.3104 6.8927-2.7144 9.3226-5.0138zm135.6583.4933c-.506-.4208-1.589-.0734-2.32.1734-4.937 1.6673-9.627 3.7779-11.537 5.5556 3.414-.9563 10.701-3.2543 14.464-4.696.116-.0442.131-.1568.072-.2897-.077-.1763-.251-.3866-.679-.7433zm-83.627-.2963c-.506-.4208-1.589-.0734-2.32.1734-4.937 1.6673-9.629 3.7776-11.539 5.5556 3.415-.9563 10.703-3.2543 14.467-4.696.115-.0441.124-.1568.072-.2894-.069-.1802-.251-.3869-.68-.7436z" fill="#010205" fill-rule="evenodd"/></svg>'
  ),
  cayman: escapeHashCharacters(
    '<svg height="40" width="256" viewBox="0 0 256 40" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="m255.109 25.4872c-.067-.2101-.63-1.36-1.216-1.6586-.394-.1383-.82-.1594-1.226-.0608-1.583.3266-3.185.5592-4.795.6966-1.983.1161-2.138-.4091-1.249-1.5812 1.718-2.2723 4.188-4.9039 6.149-7.1873.168-.1913.278-.4262.318-.6777.04-.2514.008-.5091-.092-.7431-.154-.376-.337-.763-.519-1.1555-1.387-2.9689-18.23 2.897-21.793 4.0967l4.463-4.9758-7.126.1493-6.955 7.8783c-2.044.9012-3.315 1.4596-5.254 2.2115-2.132.8846-2.602.4976-3.265-.4865-.513-.763-.734-1.8853-.116-2.6372l5.751-7.0491c-4.972-.1271-14.788.6248-22.506 2.9247-7.303 2.2115-12.578 4.9758-13.982 8.3926-2.491.4422-5.784.9067-6.629.9564-2.016.1161-2.176-.4202-1.27-1.6088 1.839-2.4271 4.513-5.2578 6.546-7.6738.171-.1939.284-.4321.326-.6874.042-.2552.011-.5171-.089-.7556-.16-.4033-.344-.7965-.552-1.1776-1.215-2.3331-13.645 1.6586-20.003 3.7318l.508-.5528c.172-.1933.286-.4315.328-.687s.011-.5177-.091-.756c-.165-.4257-.348-.8017-.552-1.1776-1.414-2.886-12.916 2.3828-17.159 3.9253l4.685-5.114-7.06.1382c-.073.0032-.145.021-.212.0523-.066.0313-.126.0756-.175.1302l-3.01 3.5051c-3.867 1.3435-8.337 2.7644-16.164 6.0816 3.933-3.5715 6.143-5.6116 10.927-9.7028l-7.602.3483-5.59 5.3794c-2.763 1.4374-8.64 3.6268-12.076 4.1631-1.166.1824-.354-.8349.176-1.5094 2.201-2.6808 4.541-5.2441 7.011-7.6793-3.409.1272-4.729.1603-7.375.2764-.553.5031-4.972 4.8653-6.8117 6.8114-1.8562.8293-3.0715 1.3877-4.9719 2.1396-2.1324.879-2.6019.492-3.2648-.4921-.5138-.7574-.7348-1.8853-.116-2.6316l5.7507-7.0491c-4.9718-.1272-14.7885.6192-22.5059 2.9247-7.3197 2.1838-11.601 4.6938-13.3577 7.2923-3.6737.3925-7.5296.5529-10.7061.8459-34.129 1.8631-43.73019-.4257-34.0958-5.0975 5.2929-2.6312 10.8356-4.726 16.5452-6.2529 14.2029-3.8369 19.8045-5.03663 35.4659-7.44713 1.4308-.24879 7.8445-1.07256 7.9163-1.07256.4595-.13365.8531-.43307 1.1048-.84036 1.4198-1.658608 1.6573-2.3331066-.243-2.36075-.4475 0-.8508 0-1.3093 0-3.3698.110574-12.286.868003-19.8266 1.84658-53.69607 6.96061-70.3407 25.43192-42.537 27.14032 10.8.6745 18.324.1216 29.6157-.8736 5.7121-.5528 11.8716-1.2218 17.7384-2.0235 1.823 2.3774 7.8114 3.0298 18.7826-1.3213 1.2098-.481 2.1268-.8404 3.3532-1.4264l1.2927-.6358c.221.5197.7347 1.5204.9889 2.0069 1.1048 2.0733 2.0108 3.4112 5.0105 2.3718 1.6573-.6082 4.0879-1.5923 6.2203-2.5542-1.707 2.5155-1.0165 3.5107 3.5906 2.7643 4.265-.6911 10.568-2.4271 13.811-3.9309-4.823 4.8044-10.767 10.9357-16.0537 16.6358l4.2147-1.0615 8.066-7.2426c6.689-5.1343 14.42-8.7422 22.649-10.5708l-4.27 4.7712-1.657 1.83 3.408.0277h.05c1.554-.1143 3.024-.7515 4.171-1.8079l4.132-3.9807c4.268-1.6235 8.638-2.9644 13.082-4.0138.187 0 .215.0885.082.3041-2.495 2.9926-4.81 6.1311-6.933 9.3988l4.155-.0387c.735-.0016 1.462-.158 2.133-.459s1.271-.7398 1.761-1.2881l4.265-4.7878c.214-.2101.476-.3655.762-.4534 6.077-1.9129 9.944-2.8749 12.076-3.1735.188 0 .21.0996.067.3096-2.513 2.5777-4.772 5.3919-6.745 8.4036-.956 1.5812.199 1.8743 3.121 1.9793 2.513.0711 5.027-.0824 7.513-.4589 2.646-.3704 5.601-.879 7.878-1.349 1.823 2.3774 7.85 3.085 18.81-1.266 1.21-.481 2.127-.8459 3.353-1.4264l1.293-.6414c.221.5197.751 1.526.988 2.0069 1.05 2.1009 2.011 3.4168 5.011 2.3719.9-.3318 2.049-.7796 3.259-1.2827.106-.0261.217-.0203.319.0165.103.0368.192.1031.257.1905s.102.192.108.3008c.006.1087-.021.2167-.076.3104-.063.0762-.103.1689-.116.2671-.012.0982.004.1978.046.2873.043.0894.11.1649.194.2175.083.0526.18.0802.279.0796h2.304.05c1.526-.1163 2.969-.7411 4.099-1.7747l4.563-4.4893c5.231-1.7722 10.606-3.0874 16.064-3.9309.188 0 .243.1161.067.3041-2.449 2.5154-4.647 5.2632-6.563 8.2045-.945 1.5536.193 1.8411 3.066 1.9406 2.47.0749 4.942-.075 7.386-.4478 1.038-.1438 2.889-.4368 3.027-.4589 1.734-.3046 3.447-.722 5.126-1.2495.238-.0995.282-.2267.233-.3815zm-177.0096-4.0912c-1.6572.5529-2.9112.8901-4.0492 1.1887-7.6014 1.8023-6.4966-.8183 1.0219-3.7817 4.661-1.8649 9.5421-3.1228 14.5234-3.7429-2.9168 2.8197-6.7231 4.727-11.4961 6.3359zm132.5106-6.0318c-2.916 2.8196-6.723 4.727-11.496 6.3359-1.657.5528-2.911.8901-4.049 1.1886-7.585 1.8245-6.48-.7961 1.022-3.765 4.66-1.8655 9.539-3.1288 14.518-3.7595z" fill="#010205" fill-rule="evenodd"/></svg>'
  ),
  macan: escapeHashCharacters(
    '<svg height="28" width="204" viewBox="0 0 204 28" xmlns="http://www.w3.org/2000/svg"><path d="m144.098 22.779c-2.569.3929-3.853.2619-3.853-.3929 0-.6544 1.201-1.4987 3.606-2.5333 2.404-1.0347 5.261-1.9379 8.572-2.7106 2.938-.685 5.544-1.0648 7.822-1.1422l-.341.2975c-1.759 1.5454-4.19 2.9135-7.295 4.105-3.105 1.1919-5.942 1.9836-8.511 2.3765zm-61.9996 0c-2.5697.3929-3.8535.2619-3.8535-.3929 0-.6544 1.2016-1.4987 3.6058-2.5333 2.4042-1.0347 5.2615-1.9379 8.5731-2.7106 2.937-.685 5.5431-1.0648 7.8211-1.1422l-.3408.2975c-1.759 1.5454-4.1902 2.9135-7.2949 4.105-3.1056 1.1919-5.942 1.9836-8.5108 2.3765zm120.8316-.2913c-.099-.3206-.246-.5237-.441-.6074-.196-.0836-.49-.0696-.882.0421-1.371.4188-2.665.7196-3.882.901-1.218.1818-2.204.2514-2.959.2094-.756-.0416-1.134-.1741-1.134-.3981 0-.1953.294-.6562.882-1.3831.587-.7264 1.231-1.4808 1.93-2.2638.98-1.0896 1.735-1.9765 2.267-2.6614.531-.6848.798-1.1529.798-1.4044 0-.279-.078-.6214-.231-1.0272-.154-.4043-.392-.7539-.714-1.0475s-.707-.4406-1.154-.4406c-1.456 0-3.659.4131-6.611 1.2371-2.706.7555-6.655 2.0456-11.838 3.8689l4.554-4.9803-6.8.7129-6.361 7.2181c-2.003.7498-3.507 1.2714-4.511 1.5634-1.007.2936-1.679.4401-2.014.4401-.225 0-.435-.1392-.63-.4193-.196-.2785-.357-.6074-.483-.9846-.126-.3777-.189-.7056-.189-.9851 0-.2235.126-.517.378-.8807.252-.3627.776-.9774 1.574-1.844.798-.8657 1.811-1.9417 3.043-3.2277l1.512-1.5931h-5.373c-3.779 0-8.13.5316-13.055 1.5931-4.926 1.0625-9.138 2.4457-12.635 4.1499-2.047.9976-3.49 2.0285-4.339 3.0926-1.518.465-2.977.8823-4.371 1.2454-1.553.4058-3.463.7758-5.73 1.1109-2.267.3357-4.66.503-7.178.503-1.148 0-2.057-.1185-2.729-.3559-.671-.237-1.007-.7056-1.007-1.4045 0-.8381 1.021-1.7188 3.064-2.6405 2.043-.9223 4.673-1.7817 7.892-2.5782 3.217-.796 6.59-1.4595 10.116-1.9911.392-.3907.706-.7399.945-1.048.237-.307.37-.572.398-.796.057-.5029-.293-.7544-1.049-.7544-3.218 0-7.178.5097-11.879 1.5296-4.702 1.0205-8.767 2.3756-12.194 4.0663-1.928.9504-3.313 1.9469-4.157 2.9897-.971.344-1.764.6059-2.371.7825-1.007.2936-1.679.4401-2.015.4401-.224 0-.434-.1392-.63-.4193-.195-.2785-.356-.6074-.482-.9846-.126-.3777-.189-.7056-.189-.9851 0-.2235.126-.517.378-.8807.252-.3627.776-.9774 1.574-1.844.797-.8657 1.812-1.9417 3.043-3.2277l1.511-1.5931h-5.373c-3.7778 0-8.1294.5316-13.0543 1.5931-4.926 1.0625-9.1376 2.4457-12.6353 4.1499-3.3207 1.618-5.0618 3.3243-5.2303 5.1185-.2576.0171-.779.0857-1.5699.2047-2.2947.3081-4.2256.5029-5.7928.5871-1.5673.0837-2.3504-.0977-2.3504-.545 0-.3913.6358-1.3624 1.9096-2.9134 1.2733-1.5509 2.9175-3.437 4.9323-5.6583 2.0152-2.2217 3.9597-4.3245 5.835-6.30877 1.4272-1.53642 2.6927-2.90605 3.7989-4.10785 1.1052-1.20129 1.6578-1.85804 1.6578-1.97027 0-.27902-.14-.6287-.4194-1.04749-.2804-.41931-.6717-.782498-1.1754-1.090093-.5037-.307076-1.0776-.4608736-1.7213-.4608736-2.4627 0-5.7788 1.0412466-9.9482 3.1227166-4.1705 2.08198-8.1583 4.35933-11.9635 6.83253-3.8062 2.4727-7.766 5.1491-11.8797 8.0271-.8674.6147-1.6021 1.1249-2.2036 1.5297-.6021.4053-.9028.5804-.9028.5243 0-.0562.5942-.6428 1.7842-1.7609 1.189-1.1171 2.5397-2.3751 4.0508-3.7722 3.7781-3.4652 6.7581-6.2387 8.9414-8.32069 2.1823-2.08146 3.2739-3.26248 3.2739-3.54202 0-.30707-.1613-.67702-.4828-1.11087-.3221-.43282-.7556-.810039-1.3014-1.131663-.5453-.320585-1.1406-.481657-1.7837-.481657-2.4913 0-6.7727 1.48134-12.8449 4.44298-6.0734 2.96217-12.719 6.60912-19.9392 10.93992-7.2201 4.3318-13.86632 8.5373-19.939127 12.6171h.881447c2.6308-.0561 4.4707-.133 5.52021-.2307 1.04899-.0982 1.98663-.3076 2.81239-.6287.82528-.3216 1.86798-.901 3.12718-1.7396 5.1768-3.3534 10.3265-6.5182 15.4477-9.4939 5.1211-2.9761 9.3462-5.3164 12.6768-7.02113 3.3302-1.70424 4.9952-2.4166 4.9952-2.13758 0 .02806-.1467.18861-.4407.48166-.294.29356-.665.66403-1.1125 1.11139-5.233 5.14136-11.0258 11.19136-17.378 18.14966 2.854 0 4.8692-.0421 6.0441-.1257 1.1755-.0837 2.2598-.3211 3.2537-.7129.9928-.3907 2.2733-1.1036 3.8406-2.1376l8.4377-5.491c4.337-2.7668 7.9262-5.0155 10.7667-6.7489 2.84-1.73227 4.9811-2.96889 6.4225-3.7093 1.4413-.73989 2.1619-.95708 2.1619-.64948 0 .02754-.2096.27953-.6295.75392-.42.47594-.9236 1.02098-1.5111 1.63514-2.2671 2.48722-4.2397 4.68822-5.9188 6.60182-1.6791 1.9142-3.2255 3.8497-4.6388 5.8054-1.4132 1.9562-2.1198 3.3815-2.1198 4.2757 0 .8381 1.1754 1.3202 3.5263 1.446 2.3509.1257 5.0649-.0146 8.1432-.4193 2.7021-.356 4.8755-.7815 6.5213-1.2767.8232.8122 2.2702 1.2673 4.3511 1.3608 3.442.1528 7.5349-.6287 12.2777-2.3475 2.2052-.7991 4.2819-1.738 6.2419-2.8052.484 1.2283.9023 2.1662 1.2514 2.8052.4194.769.7972 1.2855 1.1333 1.551.3356.265.7275.398 1.1755.398.6988 0 2.5395-.5305 5.5195-1.5925.639-.2276 1.253-.4515 1.851-.6724.191.5711.635 1.061 1.339 1.4684.966.5596 2.239.9706 3.821 1.2366 1.58.2655 3.308.398 5.184.398 2.098 0 4.554-.2447 7.367-.7331 2.812-.489 5.554-1.1109 8.227-1.8653.69-.1949 1.348-.3897 1.977-.5846.342 1.6913 2.038 2.6063 5.095 2.7434 3.443.1528 7.535-.6287 12.279-2.3475 2.204-.7991 4.282-1.738 6.242-2.8052.484 1.2283.902 2.1662 1.251 2.8052.419.769.797 1.2855 1.133 1.551.336.265.728.398 1.175.398.7 0 2.54-.5305 5.52-1.5925.386-.1377.764-.2738 1.136-.4095l-1.912 2.1698h3.232c.979 0 1.812-.1122 2.498-.3351.685-.2234 1.265-.5871 1.742-1.0901l3.766-4.0699c3.106-1.0418 5.793-1.9012 8.05-2.574 2.672-.796 4.667-1.3203 5.982-1.5718s1.973-.2655 1.973-.0421c0 .0837-.224.3918-.672.9223-.448.531-.951 1.1181-1.511 1.7609-1.316 1.4813-2.351 2.7034-3.106 3.6672-.756.9644-1.133 1.6284-1.133 1.9911 0 .9503 1.091 1.4179 3.274 1.4044 2.182-.0145 4.722-.3351 7.618-.9643 2.897-.6287 5.17-1.2782 6.822-1.949-.113-.6983-.217-1.208-.315-1.5302z" fill="#010205"/></svg>'
  ),
  panamera: escapeHashCharacters(
    '<svg height="28" width="287" viewBox="0 0 287 28" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="m27.1104 18.7286c56.7282-5.7133 50.8771-20.88421 18.2815-18.470623-3.5401.262122-10.9254.914153-17.7281 2.009783-6.3787 1.02696-12.1713 2.25119-16.2751 3.52338-2.71217.84059-4.37609 1.71278-5.54322 2.92012s-1.61546 1.66344-1.40375 1.61304c5.92927-1.40623 11.88137-2.46234 17.89407-3.45525 40.791-6.736958 54.173 1.07492 7.0704 7.92445-2.3835.2561-4.9457.6523-7.5114.7782 3.1765-2.7142 6.3492-5.443 9.4726-8.17758-2.6827.33623-7.3777.83377-10.0704 1.22804-8.0405 6.71954-14.67912 12.86764-21.081668 19.03214l4.553448-.0103c1.49444-.0831 3.13021-.7485 4.1885-1.6068 2.64452-2.1444 5.43762-4.1645 7.99992-6.2893 3.3708-.3695 6.9055-.6924 10.1532-1.0193zm195.7916-5.3113c.736.7109 1.056 1.0667 1.606 2.0738.112.2047.225.5097.301.7533.153.493-.054 1.1989-.783 1.5802-1.7.8887-5.585 2.2829-9.652 3.5702l-.453.1425c-2.945.9234-5.946 1.7792-8.248 2.3366 4.322.639 14.453.0289 21.617-1.9318l7.211-8.2691 6.815-.4014-3.249 3.6641c4.108-1.756 17.319-5.8406 19.094-3.2425.217.3179.529 1.1076.639 1.7921.107.6635.098 1.0815.072 1.4901.974-.3634 2.069-.7018 3.231-1.0316 7.508-2.1338 16.708-2.772 21.549-2.6546l-5.312 6.0936c-.573.5128-.5 1.521.014 2.3129.657 1.0132 1.265 1.3466 3.274.574.746-.2937 1.63-.6864 3.252-1.4215.714-.3326 1.432-.1976 1.729.416l.636 1.2047c-2.199 1.4331-7.08 3.4223-10.213 4.5137-2.864.9696-4.221-.175-5.209-2.308-.2-.4477-.409-.912-.634-1.419-.199.0937-.403.1882-.598.2764-3.416 1.5449-7.715 3.1142-11.329 3.8289-14.135 2.7965-14.747-4.2128-4.548-8.8772-1.094.2643-2.26.5035-3.071.6878-2.243.5098-2.977.2108-1.994-1.0407.041-.0524.056-.07.129-.17.129-.1874.11-.28-.058-.2781-2.308.3288-7.341 1.0556-14.8 3.9422l-4.259 4.0726c-1.034.8969-2.211 1.5411-3.705 1.6248l-3.342-.0011 1.713-1.8888c-4.311.9919-10.866 1.7709-14.814 2.0048-2.364.1399-4.272.1798-5.48.181l-.18-.0001c-.524-.0012-.897-.01-1.093-.0202-.237-.0124-.488-.008-.708-.0254-1.733-.1132-4.28-.3973-5.55-1.5336-2.065.4513-4.907.952-7.432 1.3129-2.388.3417-4.479.4891-6.638.4114-2.584-.0923-3.606-.3563-2.758-1.7783 1.371-2.2992 3.906-5.3839 5.956-7.5521.13-.1879.11-.28-.057-.2781-1.892.2693-5.731 1.4039-11.136 3.1704l-3.974 4.3914c-.92 1.0162-1.948 1.489-3.442 1.573l-3.67.0356c1.646-2.6568 4.539-6.6092 6.124-8.4721.119-.1937.094-.2838-.075-.2709-1.797.3659-6.517 1.6888-11.559 3.6088l-3.649 3.5765c-1.036.8969-2.213 1.5412-3.708 1.6249l-3.033-.0267 2.738-3.1555c-2.262 1.0641-4.645 1.9613-6.32 2.5226-2.872.9633-4.229-.1813-5.221-2.2994-.196-.4359-.399-.898-.619-1.3827-.198.0937-.402.1882-.597.2764-1.194.54-2.339 1.0068-3.51 1.4573-10.674 4.0276-16.97 3.5416-18.761 1.3279-1.797.3571-3.658.6861-5.807.9938-2.388.3417-4.479.4886-6.638.4114-2.584-.0926-3.6059-.3565-2.7583-1.7786 1.3713-2.2994 3.8503-5.3345 5.8993-7.5028.159-.173.111-.2799-.057-.278-2.29.326-7.2263 1.2121-14.4335 3.6055l-4.0962 4.1563c-1.036.8966-2.2139 1.5408-3.7078 1.6249l-3.0767-.0152 2.2296-2.7857c-1.9541.8558-4.0126 1.6513-5.5285 2.1801-2.8826.9721-4.2396-.1725-5.2488-2.3039-.2128-.4414-.4149-.8946-.6263-1.3694-.1989.0937-.4027.1882-.5978.2764-1.1938.54-2.3389 1.0068-3.5103 1.4573-4.9933 1.8844-9.0286 2.7808-12.026 2.9739-8.2884.7432-10.4287-4.5767-1.9105-8.8132 1.9993-.9947 5.0973-2.2415 8.9586-3.339 7.5079-2.1336 16.7084-2.7717 21.5494-2.6543l-5.6074 6.4022c-.5903.5511-.5167 1.5927-.0033 2.4107.6566 1.0465 1.2653 1.391 3.3408.5663 1.4729-.5585 3.3538-1.3072 4.9422-1.9646l5.8075-6.8726 6.6776-.4051-4.0099 4.5476c3.2166-1.0997 18.3463-6.4648 19.5933-3.7496.166.3596.33.7109.468 1.0586.137.3428.173.8462-.205 1.2959-1.762 2.0955-3.982 4.5029-5.53 6.5813-.798 1.0708-.66 1.553 1.123 1.4461.789-.0471 2.115-.2163 4.354-.6428.186-.582.567-1.089 1.021-1.6197 1.932-2.2594 6.426-4.4759 13.197-6.4 7.507-2.1336 16.708-2.7717 21.549-2.6543l-5.599 6.4245c-.577.5346-.503 1.5764.01 2.3942.657 1.0463 1.26 1.367 3.318.5541 1.597-.6012 3.711-1.4499 5.398-2.1542l5.448-6.5022 6.638-.3546-4.016 4.5285c3.748-1.3865 13.909-6.122 15.159-3.5305.162.3375.322.6751.47 1.0586.132.3453.178.8498-.208 1.2989l-.452.5001c1.855-.6194 4.294-1.4237 6.767-2.148l.45-.1308c4.877-1.4056 9.761-2.4386 10.46-1.0745.191.3731.335.7034.467 1.0589.13.3461.177.8498-.207 1.2986-1.797 2.1721-4.163 4.7146-5.787 6.8952-.798 1.0708-.66 1.553 1.123 1.4461.704-.0423 2.67-.3126 4.674-.6729l.294-.0534.293-.0545c.049-.0092.098-.0184.146-.0277.173-1.6141 1.943-3.5264 5.318-5.4577 2.838-1.6237 8.573-3.762 13.336-4.9989 2.709-.7037 7.34-1.4631 8.909.1678zm52.302 3.1753c-4.924.5301-9.603 1.7286-14.268 3.3385-7.411 2.6899-8.445 5.0119-.946 3.3769 1.123-.2691 2.54-.6317 4.176-1.1316 4.708-1.4595 8.161-3.0229 11.038-5.5838zm-199.4272-.3457c-4.9236.5304-9.6032 1.7286-14.2671 3.3385-7.4123 2.6903-8.4456 5.012-.9468 3.3767 1.1234-.269 2.5404-.6314 4.1753-1.1316 4.7083-1.4594 8.1614-3.0227 11.0386-5.5836zm66.9362 0c-4.924.5304-9.604 1.7286-14.268 3.3385-7.412 2.6903-8.445 5.012-.946 3.3767 1.123-.269 2.54-.6314 4.175-1.1316 4.708-1.4594 8.162-3.0227 11.039-5.5836zm72.807.389c-5.613 1.7509-10.946 3.9667-13.117 5.8332 3.881-1.0039 12.166-3.4169 16.445-4.9307.131-.0463.14-.1645.082-.304-.079-.1891-.285-.4061-.773-.7806-.575-.442-1.807-.0772-2.637.1821z" fill="#010205" fill-rule="evenodd"/></svg>'
  ),
  taycan: escapeHashCharacters(
    '<svg height="40" width="186" viewBox="0 0 186 40" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="m55.4326 0c-.7363.817155-1.6639 1.68099-2.5143 2.47328-.3205.29841-.6297.58636-.9154.85947-.6532.62476-1.42 1.17665-2.3454 1.57367-.9258.39745-2.0118.64133-3.3038.64962-3.7097.03229-7.4194.20069-11.1248.36168-2.7865.12085-5.5682.23603-8.356.31063-1.471 1.73204-2.9629 3.43702-4.4892 5.12015-1.4383 1.5864-2.8919 3.1583-4.3629 4.7141-1.9609 2.0745-3.9466 4.1281-5.9249 6.186l-.708.7364 12.985-3.1778c6.7575-4.1011 15.0826-6.207 29.2717-6.0757l-5.5452 6.4853c-.4829.565-.0762 1.7731.3615 2.5523.5609.9969.9628 1.2032 2.719.5514 1.8324-.5959 4.7548-1.5645 6.7741-2.4471 1.6935-1.9152 5.411-5.6411 5.9762-6.0359 2.48-.4132 4.2466-.4293 7.6711-.7797-1.9448 1.9363-5.3035 5.4121-7.1024 7.7035-.037.0472-.0755.0961-.1145.1463l-.0589.0759-.0591.0774c-.4624.6097-.8897 1.3024.0618 1.1536 3.2943-.5148 8.9253-2.6172 11.5851-4.0007l5.3609-5.1621 7.7499-.6963c-1.3745 1.1809-2.7859 2.4145-4.1949 3.6621l-.4695.4162c-.4693.4167-.9378.8345-1.4042 1.2519l-.4656.4172c-5.5768 5.0035-10.7662 9.8827-13.0559 12.1463 3.9065-1.9912 11.6273-4.9789 17.0597-6.714-.2757-2.7651 4.6463-6.018 13.8803-8.6789 5.647-1.5994 11.891-2.3393 15.787-2.5649.33-.0179.636-.0222.943-.0209 1.352.0209 1.219.5767.238 1.7634-.235.2784-.419.5441-.797.6134-.021.0039-.043.008-.066.0121l-.138.0241c-1.964.3203-3.983.6627-5.554 1.0026-5.177 1.1378-9.27 2.1347-12.1396 3.3389-1.8533.7774-7.8649 3.9365-.7342 4.7354 3.1148.349 7.8128.6971 17.5868-1.185.587-1.3311 2.792-2.7782 5.088-4.0033 1.387-.7447 5.481-2.4475 9.425-3.5195 7.46-2.0278 16.027-2.5937 20.829-2.4462l-5.606 6.2122c-.63.7744-.519 1.5562-.019 2.3537.64 1.0218 1.976 1.3599 4.26.5288 1.559-.5676 3.12-1.0645 4.77-1.6958l6.133-7.0433 6.627-.3508-4.008 4.4125c1.117-.3673 3.678-1.2324 6.592-2.0897.389-.1162.783-.2323 1.181-.3472l.341-.0981c5.189-1.4838 10.787-2.7167 11.517-1.2855.184.3604.332.6933.457 1.0371.122.3346.171.8307-.214 1.2665-.782.9168-1.67 1.9011-2.559 2.8951l-.532.5971c-.972 1.095-1.918 2.1875-2.696 3.2003-.798 1.0401-.663 1.6287 1.105 1.5427.38-.0178 1.295-.1051 2.259-.2434.825-.1147 1.736-.3006 3.462-.6544.761-.1641 1.429.1178 1.588.767l.363 1.2839c-3.707.99-6.175 1.3429-8.569 1.6156-2.274.2504-4.268.4459-6.566.3529-2.559-.1034-3.575-.3726-2.725-1.7551 1.376-2.2355 3.913-5.3532 5.96-7.4565.195-.1841.132-.2923-.055-.2718-2.274.3028-7.297 1.1662-14.463 3.454l-4.464 4.4126c-.96.9493-2.216 1.4794-3.698 1.551l-3.044-.0158 2.424-2.7424c-2.806.986-4.878 1.4929-6.449 1.968-2.882.8722-4.205-.1972-5.191-2.2848-.209-.4327-.406-.876-.613-1.3415-.198.0899-.401.181-.595.2661-1.188.5192-2.327.9677-3.492 1.3992-4.966 1.8057-8.976 2.6539-11.951 2.8223-2.869.2338-5.413-.1889-6.364-1.209-6.781 1.3063-12.102 1.6134-16.1792 1.7543-6.0912.2103-9.7644-.4446-11.754-1.7311-2.2629.7254-5.4678 1.8941-8.7897 3.1834l-.5254.2046-.5266.2062c-.3513.1381-.7029.2771-1.054.4166l-.5259.2098c-4.552 1.8208-8.9167 3.709-10.9803 4.8383-2.297 1.2569-3.6983 2.3241-5.6213 3.3777l-4.0476.8804c5.07-5.4688 10.2925-10.7975 14.9193-15.4103-3.1336 1.4462-8.782 2.9558-12.8731 3.6181-4.4147.7146-5.0801-.2383-3.4571-2.6382.0313-.0458.4324-.699.8169-1.1854-2.7025 1.2595-6.4004 2.5601-8.5551 3.2149-2.5731.8922-3.7201-.4751-4.7387-2.5064-.2382-.4755-.4498-.9332-.6745-1.4611-3.5068 1.5401-7.5148 3.0614-11.3987 3.8096-9.5692 1.8442-12.0792-.8119-9.9725-3.9776l-12.29218 2.9873c-.3205.2268-.65189.4349-.99721.616-.20989.1095-1.54239.7085-2.75036.7068h-3.709705c1.417865-1.6679 2.828765-3.3415 4.248365-5.0077 1.48667-1.7447 2.97681-3.4867 4.46696-5.2288 1.53373-1.7927 3.06303-3.5884 4.59583-5.382 1.6008-1.8725 3.1989-3.74675 4.7975-5.62058l-1.4553.0794c-2.7182.14877-5.202.28489-7.63234.40967-2.73861.14092-5.47723.27486-8.21671.39614 1.39391-1.42402 2.83876-2.82841 4.24922-4.20357 3.37483-.3307 6.75493-.61995 10.13493-.88826 4.1112-.32722 8.2246-.62476 12.3392-.89307 4.5998-.30016 9.2022-.571094 13.8055-.810612 4.591-.238646 9.1839-.449806 13.7784-.624318zm-9.0907 16.4888c-4.689.4276-8.8912 1.4572-13.3626 3.0073-7.1089 2.5994-8.6865 5.3095-1.2214 3.6687 1.0738-.2509 2.4286-.5912 3.994-1.068 4.5092-1.3935 7.7904-3.0313 10.59-5.608zm96.9321-.0384c-4.824.4961-9.413 1.6609-13.991 3.2359-7.274 2.6347-8.302 4.9444-.949 3.3633 1.101-.2613 2.491-.6138 4.096-1.102 4.619-1.4245 8.01-2.9611 10.844-5.4972z" fill="#010205" fill-rule="evenodd"/></svg>'
  ),
  turbo: escapeHashCharacters(
    '<svg height="28" width="161" viewBox="0 0 161 28" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="m144.304 17.216c2.572-.9448 4.973-1.5153 6.813-1.6864 1.825-.1706 3.1.0451 3.393.7019.293.6569-.456 1.6353-1.897 2.6817-1.454 1.0556-3.481 2.2546-6.053 3.2266-2.57.9724-5.207 1.5331-7.122 1.7347-1.923.2026-3.272-.0131-3.561-.6987-.29-.6862.525-1.7054 2.065-2.7914 1.528-1.0773 3.791-2.2242 6.362-3.1684zm-43.787 6.3629c3.166-2.7973 5.981-4.1987 11.164-6.0329 1.799-.5462 2.855-.8465 4.092-1.1401 8.599-1.9367 7.715 1.5044-.443 4.4425-5.134 1.7592-9.394 2.3487-14.813 2.7305zm-76.5658 3.9162c3.1594-.2395 6.5016-.6281 9.5609-1.1871.1414.7604 1.1631 1.0477 3.9816 1.0613 2.6809.0136 8.9121-.4376 16.3734-2.2228.1267.2101.2714.4099.4225.5906 1.2513 1.4907 2.08 1.8543 5.669 1.0586 1.3415-.3113 3.3231-.8317 5.4194-1.4287l-1.3763 1.6877 3.85.012c1.5193-.0892 2.3551-.8986 3.4074-1.8565l4.4394-4.4663c3.3209-1.3503 6.377-2.3132 8.7267-2.9369 1.192-.3532 2.5613-.6814 3.7717-.9808 2.1463-.5312 3.2997.2531 3.7603 1.7831.0326.1094.0495.1703.242.142 1.5503-.2308 3.7037-.6548 5.2742-.9187l-7.9986 9.2194c5.5358-.0566 14.3332-.1622 21.3372-1.6698 1.754-.3772 4.169-.9699 5.978-1.5349.053.1285 1.152 1.9322 1.214 2.0182.948 1.321 1.691 1.7232 4.688 1.3193 1.727-.2329 4.434-.7919 7.396-1.4505 2.182 2.4466 9.154 2.5576 16.78.0692 8.634-2.8172 14.837-7.8996 13.854-11.3509-.983-3.4517-8.779-3.9661-17.412-1.1489-7.294 2.3801-12.853 6.3767-13.803 9.6363-1.293.2978-2.626.5819-3.821.7637-1.936.2944-2.321.1398-2.899-.5498-.446-.5312-.786-1.6992-.154-2.1036.785-.4566 1.771-1.045 2.411-1.5092 6.867-4.9916 5.097-10.03754-9.174-7.1921-2.871.5726-8.151 2.4487-10.928 3.9041l13.375-14.93813-6.765.166-12.0688 13.82833c-.2702-.5655-.7319-1.4521-1.0729-1.9898-.2023-.3195-.4899-.7163-.8205-1.0331-.7075-.6781-1.5906-.8626-3.204-.7179-4.2307.3794-11.4598 2.8934-14.6138 4.222l3.4199-4.0821-7.1878.5617-7.4857 9.2205c-1.9696.6374-4.8376 1.4973-6.0089 1.788-1.8945.4691-2.2605.3472-2.8402-.3435-.4062-.4838-.5438-1.2518-.1343-1.7258 2.5009-2.8961 4.9305-5.8826 8.0198-9.2935l-6.663.4675c-2.5194 3.0202-5.0855 5.8167-7.4238 8.9566-.0892.1197-.1626.2389-.217.3472-3.0773 1.1103-8.7267 1.6236-11.8524 1.5703-1.1223-.0191-.3376-.8018.1708-1.4489 1.7956-2.2854 7.1285-7.9268 9.0698-9.8579-1.7222.1138-4.3894.2335-6.6424.3418-.4306.3005-3.9631 3.7969-5.9892 5.9005-1.6357 1.7047-3.3889 3.6896-4.3438 4.9643-4.2578.8126-9.7969 1.1952-14.7306 1.2132-2.5798.0092-5.0208.0065-7.0007-.1606-3.13389-.1437-3.32421-1.0477-1.7092-3.0321 3.4868-4.2873 7.9159-8.8211 13.841-13.32819 4.4096-.13008 8.823-.16273 13.4158-.17144 2.4166-.04899 4.7756-.35215 6.4629-1.69215l3.427-2.68926c-6.0714.13662-12.0536.2433-18.007.39733 1.2975-.96391 3.5792-2.63429 4.8614-3.69399l-7.8136.0810966c-2.0332 1.4945734-3.5444 2.3915334-5.241 3.8284234-3.5113.15239-7.6511.28955-11.1335.46862l-4.32965 3.88121c3.25021-.16274 7.21065-.26288 10.53855-.34724-5.3699 4.17079-10.10189 8.47709-13.91111 13.03209-3.46773 4.1474-2.951136 6.0708 2.27139 6.6891 2.77767.3282 8.45042.51 14.35112.2259 1.7113-.0822 3.441-.2036 4.9946-.3641z" fill="#010205" fill-rule="evenodd"/></svg>'
  ),
};

// copied from icon-styles
const filterDarkPrimary = 'invert(97%) sepia(55%) saturate(2840%) hue-rotate(180deg) brightness(114%) contrast(103%)';

export const getComponentCss = (
  model: ModelSignatureModel,
  size: ModelSignatureSize,
  color: ModelSignatureColor,
  theme: Theme
): string => {
  // eslint-disable-next-line no-console
  console.log(size, color);

  return getCss({
    '@global': {
      ':host': {
        display: 'block',
        ...addImportantToEachRule({
          height: '28px',
          ...(isThemeDark(theme) && { filter: filterDarkPrimary }),
          background: `url('data:image/svg+xml;charset=UTF-8,${modelToSvgMap[model]}') no-repeat`,
          ...hostHiddenStyles,
        }),
      },
    },
  });
};
